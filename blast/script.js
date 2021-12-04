var blast = {
    start: function(){
        this.canvasParent = canvasElement.parentNode;
        this.spawnShips(this.settings.player);
        canvas.lineCap = "round";
    },
    randomColor: function(){
        return 'rgb(' +
            (Math.floor(Math.random() * 200) + 55) + ', ' +
            (Math.floor(Math.random() * 200) + 55) + ', ' +
            (Math.floor(Math.random() * 200) + 55) + ')';
    },
    spawnShips: function(spawnPlayer){
        this.ships = {};
        this.lasers = {};
        if(spawnPlayer){
            this.createShip(null, null, "Player");
        }
        for(var i = 0; i < this.settings.shipCount; i++){
            this.createShip();
        }
    },
    createShip: function(shipColor, shipSize, shipName, shipHealth){
        if(!shipColor){
            shipColor = this.randomColor(); 
        }
        if(!shipSize){
            shipSize = this.settings.shipSize;
        }
        if(!shipName){
            shipName = "Ship " + (this.totalShips + 1);
        }
        if(!shipHealth){
            shipHealth = this.settings.shipHealth;
        }
        this.ships[shipName] = {
            name: shipName,
            color: shipColor,
            size: shipSize,
            pos: [
                Math.floor(Math.random() * size[0]),
                Math.floor(Math.random() * size[1])
            ],
            lastPos: [0, 0],
            vel: [0, 0],
            wanderDirection: Math.floor(Math.random() * 360),
            health: shipHealth,
            alive: 1,
            lastDeath: 0,

            lastFire: 0,
            lastReload: 0,
            shotsFired: 0,

            score: 0
        };
        this.ships[shipName].lastPos[0] = this.ships[shipName].pos[0];
        this.ships[shipName].lastPos[1] = this.ships[shipName].pos[1];
        this.totalShips++;
    },
    createLaser: function(laserOwner, laserPos, laserAngle, laserVel, laserColor, laserSize, laserName){
        if(!laserOwner){
            laserOwner = undefined;
        }
        if(!laserColor){
            laserColor = this.settings.laserColor;
        }
        if(!laserSize){
            laserSize = this.settings.laserSize;
        }
        if(!laserPos || typeof laserPos !== "object"){
            laserPos = [0, 0];
        }
        if(!laserAngle){
            laserAngle = 0;
        }
        if(!laserVel){
            laserVel = this.settings.laserSpeed;
        }
        if(!laserName){
            laserName = "laser_" + (this.totalLasers + 1) + "_" + (laserOwner || "?")
        }
        this.lasers[laserName] = {
            owner: laserOwner,
            name: laserName,
            pos: laserPos,
            angle: laserAngle,
            color: laserColor,
            vel: laserVel,
            size: laserSize
        }
        this.totalLasers++;
    },
    // this.fpsCount + " fps, " + this.frametime + "ms (" + this.fps + "), " + this.fpsMod,
    lastSecond: performance.now(),
    fpsCount: 0,
    fpsFinal: 0,
    lastFrame: performance.now(),
    currFrame: performance.now(),
    frametime: 0,
    fps: 0,
    fpsMod: 1,
    frame: function(){
        this.lastFrame = this.currFrame;
        this.currFrame = performance.now();
        this.frametime = this.currFrame - this.lastFrame;
        this.fps = 1000 / this.frametime;
        if(this.currFrame > this.lastSecond + 1000){
            this.fpsFinal = this.fpsCount;
            this.fpsCount = 0;
            this.lastSecond = this.currFrame;
        }
        this.fpsCount++;

        // fpsMod is modification of game timing based on the FPS
        // if the FPS is > 60, then fpsMod will be < 1
        // if the FPS is < 60, then fpsMod will be > 1
        // this way the ships and lasers all move at the same physical speed between 30, 60, and 120fps and such
        if(this.settings.fpsCompensation){
            this.fpsMod = 1 / (this.fps / 60);
        }

        canvas.clearRect(0, 0, size[0], size[1]);
        // do bullet simulation first
        for(var i in this.lasers){
            var destroyLaser = 0;
            for(var j in this.ships){
                if(this.ships[j].alive){
                    if(
                        Math.sqrt(
                            Math.pow(this.lasers[i].pos[0] - this.ships[j].pos[0], 2) +
                            Math.pow(this.lasers[i].pos[1] - this.ships[j].pos[1], 2)
                        ) < this.ships[j].size * 0.5
                    ){
                        this.ships[j].health--;
                        this.ships[j].dodging = null;
                        if(this.ships[j].health <= 0){
                            this.ships[j].alive = 0;
                            this.ships[j].lastDeath = Date.now();
                            this.ships[this.lasers[i].owner].score++;
                        }
                        destroyLaser = 1;
                    }else if(
                        this.lasers[i].pos[0] < 0 || this.lasers[i].pos[0] > size[0] ||
                        this.lasers[i].pos[1] < 0 || this.lasers[i].pos[1] > size[1]
                    ){
                        destroyLaser = 1;
                    }
                }
            }
            canvas.lineWidth = this.lasers[i].size;
            canvas.strokeStyle = this.lasers[i].color;
            canvas.beginPath();
            canvas.moveTo(this.lasers[i].pos[0], this.lasers[i].pos[1]);
            var newLaserPos = this.pointFromAngle(
                this.lasers[i].pos[0],
                this.lasers[i].pos[1],
                this.lasers[i].angle,
                this.lasers[i].vel * this.fpsMod
            );
            if(this.settings.lowFpsLasers){
                var newLaserPosFake = this.pointFromAngle(
                    this.lasers[i].pos[0],
                    this.lasers[i].pos[1],
                    this.lasers[i].angle,
                    this.lasers[i].vel * 2 * this.fpsMod
                );
                canvas.lineTo(newLaserPosFake[0], newLaserPosFake[1]);
            }else{
                canvas.lineTo(newLaserPos[0], newLaserPos[1]);
            }
            canvas.stroke();
            if(destroyLaser){
                delete this.lasers[i];
            }else{
                this.lasers[i].pos[0] = newLaserPos[0];
                this.lasers[i].pos[1] = newLaserPos[1];
            }
        }
        for(var ship in this.ships){
            if(this.ships[ship].alive){
                if(ship.indexOf("Player") !== -1){
                    // do player awareness second (oh wait this isn't AI)

                    // do player movement third
                    if(this.inputs.left){
                        this.ships[ship].pos[0] -= this.settings.shipChase * this.fpsMod;
                    }
                    if(this.inputs.right){
                        this.ships[ship].pos[0] += this.settings.shipChase * this.fpsMod;
                    }
                    if(this.inputs.up){
                        this.ships[ship].pos[1] -= this.settings.shipChase * this.fpsMod;
                    }
                    if(this.inputs.down){
                        this.ships[ship].pos[1] += this.settings.shipChase * this.fpsMod;
                    }
                    // do player firing fourth
                    if(this.inputs.mouse){
                        var ms = Date.now();
                        if(this.ships[ship].shotsFired >= this.settings.gunAmmo){
                            if(ms - this.ships[ship].lastReload > this.settings.gunReload){
                                this.ships[ship].shotsFired = 0;
                                shouldShoot = 1;
                            }
                        }else{
                            shouldShoot = 1;
                        }
                        if(ms - this.ships[ship].lastFire > this.settings.gunDelay){
                            if(shouldShoot){
                                var targetAngle = this.angleFromPoints(
                                    this.ships[ship].pos[0],
                                    this.ships[ship].pos[1],
                                    this.inputs.x,
                                    this.inputs.y
                                );
                                var laserSpawnPos = this.pointFromAngle(
                                    this.ships[ship].pos[0],
                                    this.ships[ship].pos[1],
                                    targetAngle,
                                    this.ships[ship].size + 3
                                );
                                this.createLaser(
                                    ship,
                                    laserSpawnPos,
                                    targetAngle
                                );
                                this.ships[ship].shotsFired++;
                                this.ships[ship].lastFire = ms;
                                if(this.ships[ship].shotsFired >= this.settings.gunAmmo){
                                    this.ships[ship].lastReload = ms;
                                }
                            }
                        }
                    }else if(this.ships[ship].shotsFired >= this.settings.gunAmmo && Date.now() - this.ships[ship].lastReload > this.settings.gunReload){
                        this.ships[ship].shotsFired = 0;
                    }
                }else{
                    // do ship awareness second
                    var moveMode = "default";
                    var targetShip = null;
                    var targetDist = null;
                    var targetAngle = null;
                    var dodgeAngle = null;
                    for(var otherShip in this.ships){
                        if(this.ships[otherShip].alive){
                            if(this.ships[otherShip] !== this.ships[ship]){
                                var otherDistance = Math.sqrt(
                                    Math.pow(this.ships[otherShip].pos[0] - this.ships[ship].pos[0], 2) +
                                    Math.pow(this.ships[otherShip].pos[1] - this.ships[ship].pos[1], 2)
                                );
                                if(otherDistance < this.settings.shipSightRange){
                                    if(otherDistance < targetDist || targetDist === null){
                                        targetShip = otherShip;
                                        targetDist = otherDistance;
                                        targetAngle = this.angleFromPoints(
                                            this.ships[ship].pos[0],
                                            this.ships[ship].pos[1],
                                            this.ships[otherShip].pos[0],
                                            this.ships[otherShip].pos[1]
                                        );
                                        if(this.ships[ship].pressuring){
                                            if(this.ships[ship].health > this.settings.shipHealth * 0.5){
                                                if(this.settings.shipPressureChance * this.fpsMod < Math.random()){
                                                    moveMode = "pressure";
                                                }else{
                                                    moveMode = "fight";
                                                    this.ships[ship].pressuring = 0;
                                                }
                                            }else{
                                                moveMode = "fight";
                                                this.ships[ship].pressuring = 0;
                                            }
                                        }else{
                                            if(this.ships[ship].health > this.settings.shipHealth * 0.5){
                                                if(this.settings.shipPressureChance * this.fpsMod >= Math.random()){
                                                    moveMode = "pressure";
                                                    this.ships[ship].pressuring = 1;
                                                }else{
                                                    moveMode = "fight";
                                                }
                                            }else{
                                                moveMode = "fight";
                                            }
                                        }
                                    }
                                    if(this.ships[ship].health <= this.settings.shipHealth * 0.2){
                                        moveMode = "flee";
                                    }
                                }
                            }
                        }
                    }
                    var dodging = null;
                    var closestLaser = null;
                    var dodgeAngle = null;
                    var dodgeExtraAttention = 0;
                    if(this.ships[ship].health <= this.settings.shipHealth * 0.2){
                        dodgeExtraAttention = this.settings.shipDodgeRange * 0.25;
                    }
                    for(var j in this.lasers){
                        if(this.lasers[j].owner !== ship){
                            var laserDistance = Math.sqrt(
                                Math.pow(this.lasers[j].pos[0] - this.ships[ship].pos[0], 2) +
                                Math.pow(this.lasers[j].pos[1] - this.ships[ship].pos[1], 2)
                            );
                            
                            if(laserDistance < this.settings.shipDodgeRange + dodgeExtraAttention){
                                if(laserDistance < closestLaser || closestLaser === null){
                                    dodging = j;
                                    closestLaser = laserDistance;
                                    moveMode = "dodge";
                                }
                            }
                        }
                    }
                    // do ship movement third
                    this.ships[ship].moveMode = moveMode;
                    this.ships[ship].targetShip = targetShip;
                    this.ships[ship].targetDist = targetDist;
                    this.ships[ship].targetAngle = targetAngle;
                    switch(moveMode){
                        case "fight":
                            this.ships[ship].dodging = null;
                            var moveAngle = targetAngle;
                            if(targetDist < this.settings.shipBattleRange - this.settings.shipBattleComfort){ // target is too close for comfort
                                moveAngle += 180;
                                moveAngle += Math.random() * this.settings.shipWander * 2 - this.settings.shipWander;
                                var moveCoords = this.pointFromAngle(
                                    this.ships[ship].pos[0],
                                    this.ships[ship].pos[1],
                                    moveAngle,
                                    (this.settings.shipChase * (Math.random() * 0.85 + 0.15)) * this.fpsMod
                                );
                                this.ships[ship].pos[0] = moveCoords[0];
                                this.ships[ship].pos[1] = moveCoords[1];
                            }else if(targetDist < this.settings.shipBattleRange + this.settings.shipBattleComfort){ // target is good distance away
                                if(typeof this.ships[ship].prevActionSide !== "number"){
                                    this.ships[ship].prevActionSide = Math.round(Math.random());
                                }
                                if(Math.random() < 0.05 * this.fpsMod){
                                    this.ships[ship].prevActionSide = Math.abs(this.ships[ship].prevActionSide - 1);
                                }
                                if(this.ships[ship].prevActionSide){
                                    moveAngle += 90;
                                }else{
                                    moveAngle -= 90;
                                }
                                moveAngle += Math.random() * this.settings.shipWander * 2 - this.settings.shipWander;
                                var moveCoords = this.pointFromAngle(
                                    this.ships[ship].pos[0],
                                    this.ships[ship].pos[1],
                                    moveAngle,
                                    (this.settings.shipChase * (Math.random() * 0.85 + 0.15)) * this.fpsMod
                                );
                                this.ships[ship].pos[0] = moveCoords[0];
                                this.ships[ship].pos[1] = moveCoords[1];
                            }else{ // target is too far away
                                moveAngle += Math.random() * this.settings.shipWander * 2 - this.settings.shipWander;
                                var moveCoords = this.pointFromAngle(
                                    this.ships[ship].pos[0],
                                    this.ships[ship].pos[1],
                                    moveAngle,
                                    (this.settings.shipChase * (Math.random() * 0.85 + 0.15)) * this.fpsMod
                                );
                                this.ships[ship].pos[0] = moveCoords[0];
                                this.ships[ship].pos[1] = moveCoords[1];
                            }
                            break;
                        case "pressure":
                            this.ships[ship].dodging = null;
                            var moveAngle = targetAngle;
                            if(targetDist < this.settings.shipPressureRange - this.settings.shipBattleComfort){ // target is way too close
                                moveAngle += 180;
                                moveAngle += Math.random() * this.settings.shipWander * 2 - this.settings.shipWander;
                                var moveCoords = this.pointFromAngle(
                                    this.ships[ship].pos[0],
                                    this.ships[ship].pos[1],
                                    moveAngle,
                                    (this.settings.shipChase * (Math.random() * 0.65 + 0.35)) * this.fpsMod
                                );
                                this.ships[ship].pos[0] = moveCoords[0];
                                this.ships[ship].pos[1] = moveCoords[1];
                            }else if(targetDist < this.settings.shipPressureRange + this.settings.shipBattleComfort){ // target is good pressuring distance away
                                if(typeof this.ships[ship].prevActionSide !== "number"){
                                    this.ships[ship].prevActionSide = Math.round(Math.random());
                                }
                                if(Math.random() < 0.05 * this.fpsMod){
                                    this.ships[ship].prevActionSide = Math.abs(this.ships[ship].prevActionSide - 1);
                                }
                                if(this.ships[ship].prevActionSide){
                                    moveAngle += 90;
                                }else{
                                    moveAngle -= 90;
                                }
                                moveAngle += Math.random() * this.settings.shipWander * 2 - this.settings.shipWander;
                                var moveCoords = this.pointFromAngle(
                                    this.ships[ship].pos[0],
                                    this.ships[ship].pos[1],
                                    moveAngle,
                                    (this.settings.shipChase * (Math.random() * 0.85 + 0.15)) * this.fpsMod
                                );
                                this.ships[ship].pos[0] = moveCoords[0];
                                this.ships[ship].pos[1] = moveCoords[1];
                            }else{ // target is too far away for pressuring
                                moveAngle += Math.random() * this.settings.shipWander * 2 - this.settings.shipWander;
                                var moveCoords = this.pointFromAngle(
                                    this.ships[ship].pos[0],
                                    this.ships[ship].pos[1],
                                    moveAngle,
                                    (this.settings.shipChase * (Math.random() * 0.65 + 0.35)) * this.fpsMod
                                );
                                this.ships[ship].pos[0] = moveCoords[0];
                                this.ships[ship].pos[1] = moveCoords[1];
                            }
                            break;
                        case "flee":
                            this.ships[ship].dodging = null;
                            var moveAngle = targetAngle;
                            if(targetDist < this.settings.shipFleeRange - this.settings.shipBattleComfort){ // target is close, run away
                                moveAngle += 180;
                                moveAngle += Math.random() * this.settings.shipWander * 10 - this.settings.shipWander * 5;
                                var moveCoords = this.pointFromAngle(
                                    this.ships[ship].pos[0],
                                    this.ships[ship].pos[1],
                                    moveAngle,
                                    (this.settings.shipChase * (Math.random() * 0.65 + 0.35)) * this.fpsMod
                                );
                                this.ships[ship].pos[0] = moveCoords[0];
                                this.ships[ship].pos[1] = moveCoords[1];
                            }else if(targetDist < this.settings.shipFleeRange + this.settings.shipBattleComfort){ // target is far, stay here
                                if(typeof this.ships[ship].prevActionSide !== "number"){
                                    this.ships[ship].prevActionSide = Math.round(Math.random());
                                }
                                if(Math.random() < 0.05 * this.fpsMod){
                                    this.ships[ship].prevActionSide = Math.abs(this.ships[ship].prevActionSide - 1);
                                }
                                if(this.ships[ship].prevActionSide){
                                    moveAngle += 90;
                                }else{
                                    moveAngle -= 90;
                                }
                                moveAngle += Math.random() * this.settings.shipWander * 2 - this.settings.shipWander;
                                var moveCoords = this.pointFromAngle(
                                    this.ships[ship].pos[0],
                                    this.ships[ship].pos[1],
                                    moveAngle,
                                    (this.settings.shipChase * (Math.random() * 0.85 + 0.15)) * this.fpsMod
                                );
                                this.ships[ship].pos[0] = moveCoords[0];
                                this.ships[ship].pos[1] = moveCoords[1];
                            }else{ // target is too far away to get shots off
                                moveAngle += Math.random() * this.settings.shipWander * 2 - this.settings.shipWander;
                                var moveCoords = this.pointFromAngle(
                                    this.ships[ship].pos[0],
                                    this.ships[ship].pos[1],
                                    moveAngle,
                                    (this.settings.shipChase * (Math.random() * 0.85 + 0.15)) * this.fpsMod
                                );
                                this.ships[ship].pos[0] = moveCoords[0];
                                this.ships[ship].pos[1] = moveCoords[1];
                            }
                            break;
                        case "dodge":
                            var ms = Date.now();
                            if(this.ships[ship].dodging === dodging && ms - this.ships[ship].lastDodge < this.settings.dodgeTime){
                                dodgeAngle = this.ships[ship].dodgeAngle + (Math.random() * this.settings.shipWander * 2 - this.settings.shipWander) * this.fpsMod;
                                this.ships[ship].dodgeAngle = dodgeAngle;
                            }else{
                                this.ships[ship].lastDodge = ms;
                                this.ships[ship].dodging = dodging;
                                dodgeAngle = Math.round(Math.random() * 360) + (Math.random() * this.settings.shipWander * 2 - this.settings.shipWander) * this.fpsMod;
                                this.ships[ship].dodgeAngle = dodgeAngle;
                            }
                            var newPos = this.pointFromAngle(
                                this.ships[ship].pos[0],
                                this.ships[ship].pos[1],
                                dodgeAngle,
                                this.settings.shipChase * this.fpsMod
                            );
                            this.ships[ship].pos[0] = newPos[0];
                            this.ships[ship].pos[1] = newPos[1];
                            break;
                        default:
                            this.ships[ship].dodging = null;
                            this.ships[ship].wanderDirection += (Math.random() * this.settings.shipWander - (this.settings.shipWander / 2)) * this.fpsMod;
                            if(this.ships[ship].wanderDirection > 360){
                                this.ships[ship].wanderDirection -= 360;
                            }else if(this.ships[ship].wanderDirection < 0){
                                this.ships[ship].wanderDirection += 360;
                            }
                            this.ships[ship].pos = this.pointFromAngle(
                                this.ships[ship].pos[0],
                                this.ships[ship].pos[1],
                                this.ships[ship].wanderDirection,
                                this.settings.shipIdle * this.fpsMod
                            )
                    }
                }
                // do ship firing fourth
                if(moveMode === "fight" || moveMode === "pressure" || moveMode === "flee"){
                    var shouldShoot = 0;
                    if(targetDist < this.settings.shipFireRange){
                        var ms = Date.now();
                        if(this.ships[ship].shotsFired >= this.settings.gunAmmo){
                            if(ms - this.ships[ship].lastReload > this.settings.gunReload){
                                this.ships[ship].shotsFired = 0;
                                shouldShoot = 1;
                            }
                        }else{
                            shouldShoot = 1;
                        }
                        if(ms - this.ships[ship].lastFire > this.settings.gunDelay){
                            if(shouldShoot){
                                var laserSpawnPos = this.pointFromAngle(
                                    this.ships[ship].pos[0],
                                    this.ships[ship].pos[1],
                                    targetAngle,
                                    this.ships[ship].size + 3
                                );
                                this.createLaser(
                                    ship,
                                    laserSpawnPos,
                                    targetAngle + Math.random() * this.settings.gunInaccuracy - this.settings.gunInaccuracy * 0.5
                                );
                                this.ships[ship].shotsFired++;
                                this.ships[ship].lastFire = ms;
                                if(this.ships[ship].shotsFired >= this.settings.gunAmmo){
                                    this.ships[ship].lastReload = ms;
                                }
                            }
                        }
                    }
                }
                if(this.ships[ship].shotsFired >= this.settings.gunAmmo && Date.now() - this.ships[ship].lastReload > this.settings.gunReload){
                    this.ships[ship].shotsFired = 0;
                }
                // do ship velocities, lastPos, and wall collision bumping fifth
                for(var i in this.ships){
                    var xOffset = -1;
                    var yOffset = -1;
                    if(Math.round(Math.random())){
                        xOffset = 1;
                    }
                    if(Math.round(Math.random())){
                        yOffset = 1;
                    }
                    if(this.ships[i].pos[0] < 0){
                        this.ships[i].pos[0] = 0;
                        this.ships[i].wanderDirection += 30 * xOffset;
                    }else if(this.ships[i].pos[0] > size[0]){
                        this.ships[i].pos[0] = size[0];
                        this.ships[i].wanderDirection += 30 * xOffset;
                    }
                    if(this.ships[i].pos[1] < 0){
                        this.ships[i].pos[1] = 0;
                        this.ships[i].wanderDirection += 30 * yOffset;
                    }else if(this.ships[i].pos[1] > size[1]){
                        this.ships[i].pos[1] = size[1];
                        this.ships[i].wanderDirection += 30 * yOffset;
                    }

                    this.ships[i].vel = [
                        this.ships[i].pos[0] - this.ships[i].lastPos[0],
                        this.ships[i].pos[1] - this.ships[i].lastPos[1]
                    ];
                    this.ships[i].lastPos = [
                        this.ships[i].pos[0],
                        this.ships[i].pos[1]
                    ];
                }

                // draw ships
                canvas.fillStyle = this.ships[ship].color;
                canvas.beginPath();
                canvas.arc(
                    this.ships[ship].pos[0],
                    this.ships[ship].pos[1],
                    this.ships[ship].size / 2,
                    0,
                    this.deg2rad(360)
                );
                canvas.fill();

                // debug drawing
                if(this.settings.debug){
                    canvas.lineWidth = 1;
                    // green line if wandering
                    if(this.ships[ship].moveMode === "default"){
                        canvas.strokeStyle = "#00FF00";
                        canvas.beginPath();
                        canvas.moveTo(this.ships[ship].pos[0], this.ships[ship].pos[1]);
                        var drawTarget = this.pointFromAngle(
                            this.ships[ship].pos[0],
                            this.ships[ship].pos[1],
                            this.ships[ship].wanderDirection,
                            70
                        );
                        canvas.lineTo(drawTarget[0], drawTarget[1]);
                        canvas.stroke();
                    }
                    // orange line to lasers being dodged
                    // cyan line is dodging angle
                    if(this.ships[ship].dodging){
                        if(this.lasers[this.ships[ship].dodging]){
                            canvas.strokeStyle = "#FF7F00";
                            canvas.beginPath();
                            canvas.moveTo(this.ships[ship].pos[0], this.ships[ship].pos[1]);
                            canvas.lineTo(
                                this.lasers[this.ships[ship].dodging].pos[0],
                                this.lasers[this.ships[ship].dodging].pos[1]
                            );
                            canvas.stroke();
                                
                            canvas.strokeStyle = "#00FFFF";
                            canvas.beginPath();
                            canvas.moveTo(this.ships[ship].pos[0], this.ships[ship].pos[1]);
                            var drawDodgeTarget = this.pointFromAngle(
                                this.ships[ship].pos[0],
                                this.ships[ship].pos[1],
                                this.ships[ship].dodgeAngle,
                                70
                            );
                            canvas.lineTo(drawDodgeTarget[0], drawDodgeTarget[1]);
                            canvas.stroke();
                        }
                    }
                    // if the ship has a target
                    if(this.ships[ship].targetShip){
                        var targetCoord = this.pointFromAngle(
                            this.ships[ship].pos[0],
                            this.ships[ship].pos[1],
                            this.ships[ship].targetAngle,
                            this.ships[ship].targetDist
                        );
                        // yellow line points at ship target
                        canvas.strokeStyle = '#FFFF00';
                        canvas.beginPath();
                        canvas.moveTo(this.ships[ship].pos[0], this.ships[ship].pos[1]);
                        var drawTarget = this.pointFromAngle(
                            this.ships[ship].pos[0],
                            this.ships[ship].pos[1],
                            this.ships[ship].targetAngle,
                            70
                        );
                        canvas.lineTo(drawTarget[0], drawTarget[1]);
                        canvas.stroke();
                        if(this.ships[ship].pressuring){
                            // blue arc is pressuring fighting range
                            // ship shows '):<' inside
                            canvas.strokeStyle = '#0000FF';
                            canvas.beginPath();
                            canvas.arc(
                                targetCoord[0],
                                targetCoord[1],
                                this.settings.shipPressureRange - this.settings.shipBattleComfort,
                                this.deg2rad(this.ships[ship].targetAngle + 165),
                                this.deg2rad(this.ships[ship].targetAngle + 195)
                            );
                            canvas.stroke();
                            canvas.beginPath();
                            canvas.arc(
                                targetCoord[0],
                                targetCoord[1],
                                this.settings.shipPressureRange + this.settings.shipBattleComfort,
                                this.deg2rad(this.ships[ship].targetAngle + 165),
                                this.deg2rad(this.ships[ship].targetAngle + 195)
                            );
                            canvas.stroke();
                            canvas.beginPath();
                            canvas.moveTo(this.ships[ship].pos[0], this.ships[ship].pos[1]);
                            canvas.arc(
                                targetCoord[0],
                                targetCoord[1],
                                this.settings.shipPressureRange,
                                this.deg2rad(this.ships[ship].targetAngle + 180),
                                this.deg2rad(this.ships[ship].targetAngle + 180)
                            );
                            canvas.stroke();
                            canvas.fillStyle = "#000";
                            canvas.font = "bold 12px monospace";
                            canvas.fillText("):<", this.ships[ship].pos[0] - 10, this.ships[ship].pos[1] + 4);
                        }else if(this.ships[ship].health <= this.settings.shipHealth * 0.2){
                            // blue arc is fleeing range
                            // ship shows 'D:' inside
                            canvas.strokeStyle = '#0000FF';
                            canvas.beginPath();
                            canvas.arc(
                                targetCoord[0],
                                targetCoord[1],
                                this.settings.shipFleeRange - this.settings.shipBattleComfort,
                                this.deg2rad(this.ships[ship].targetAngle + 165),
                                this.deg2rad(this.ships[ship].targetAngle + 195)
                            );
                            canvas.stroke();
                            canvas.beginPath();
                            canvas.arc(
                                targetCoord[0],
                                targetCoord[1],
                                this.settings.shipFleeRange + this.settings.shipBattleComfort,
                                this.deg2rad(this.ships[ship].targetAngle + 165),
                                this.deg2rad(this.ships[ship].targetAngle + 195)
                            );
                            canvas.stroke();
                            canvas.beginPath();
                            canvas.moveTo(this.ships[ship].pos[0], this.ships[ship].pos[1]);
                            canvas.arc(
                                targetCoord[0],
                                targetCoord[1],
                                this.settings.shipFleeRange,
                                this.deg2rad(this.ships[ship].targetAngle + 180),
                                this.deg2rad(this.ships[ship].targetAngle + 180)
                            );
                            canvas.stroke();
                            canvas.fillStyle = "#000";
                            canvas.font = "bold 12px monospace";
                            canvas.fillText("D:", this.ships[ship].pos[0] - 6, this.ships[ship].pos[1] + 4);
                        }else{
                            // blue arc is comfortable fighting range
                            // no face inside ship
                            canvas.strokeStyle = '#0000FF';
                            canvas.beginPath();
                            canvas.arc(
                                targetCoord[0],
                                targetCoord[1],
                                this.settings.shipBattleRange - this.settings.shipBattleComfort,
                                this.deg2rad(this.ships[ship].targetAngle + 165),
                                this.deg2rad(this.ships[ship].targetAngle + 195)
                            );
                            canvas.stroke();
                            canvas.beginPath();
                            canvas.arc(
                                targetCoord[0],
                                targetCoord[1],
                                this.settings.shipBattleRange + this.settings.shipBattleComfort,
                                this.deg2rad(this.ships[ship].targetAngle + 165),
                                this.deg2rad(this.ships[ship].targetAngle + 195)
                            );
                            canvas.stroke();
                            canvas.beginPath();
                            canvas.moveTo(this.ships[ship].pos[0], this.ships[ship].pos[1]);
                            canvas.arc(
                                targetCoord[0],
                                targetCoord[1],
                                this.settings.shipBattleRange,
                                this.deg2rad(this.ships[ship].targetAngle + 180),
                                this.deg2rad(this.ships[ship].targetAngle + 180)
                            );
                            canvas.stroke();
                        }
                    }
                }
                // health and ammo
                if(this.settings.shipLabels){
                    canvas.fillStyle = "#FFF";
                    canvas.font = "24px Sans-Serif";
                    canvas.fillText(
                        this.ships[ship].health + ", " + (this.settings.gunAmmo - this.ships[ship].shotsFired) + "/" + this.settings.gunAmmo,
                        this.ships[ship].pos[0] - this.ships[ship].size,
                        this.ships[ship].pos[1] - this.ships[ship].size
                    );
                }
            }else{
                if(Date.now() - this.ships[ship].lastDeath > this.settings.shipRespawn){
                    this.ships[ship].alive = 1;
                    this.ships[ship].health = this.settings.shipHealth;
                    this.ships[ship].pos = [
                        Math.floor(Math.random() * size[0]),
                        Math.floor(Math.random() * size[1])
                    ];
                    this.ships[ship].lastPos[0] = this.ships[ship].pos[0];
                    this.ships[ship].lastPos[0] = this.ships[ship].pos[1];
                }
            }
        }
            
        // scoreboard
        if(this.settings.scoreboard){
            canvas.fillStyle = "#FFF";
            canvas.fillText("Score", 10, 40);
            var textPos = 40;
            for(var i in this.ships){
                canvas.fillStyle = "#FFF";
                textPos += 30;
                canvas.fillText(this.ships[i].name + ": " + this.ships[i].score, 10, textPos);
                canvas.fillStyle = this.ships[i].color;
                canvas.fillRect(0, textPos - 24, 5, 30);
            }
            canvas.font = "24px Sans-Serif";
        }

        // debug
        if(this.settings.debug){
            canvas.fillStyle = "#FFF";
            canvas.fillText(
                this.fpsFinal + " fps, " + Math.round(this.frametime) + "ms (" + Math.round(this.fps) + "), " + this.fpsMod,
                size[0] / 2 - 125, 40
            );
        }
    },
    angleFromPoints: function(x1, y1, x2, y2){
        return this.rad2deg(Math.atan2(y2 - y1, x2 - x1));
    },
    pointFromAngle: function(x, y, deg, dist){
        return [
            x + dist * Math.cos(this.deg2rad(deg)),
            y + dist * Math.sin(this.deg2rad(deg))
        ];
    },
    end: function(){

    },
    sizechange: function(){
        canvas.lineCap = "round";
    },
    btnDown: function(e){
        switch(e.keyCode){
            case 87: // w
                blast.inputs.up = 1;
                break;
            case 65: // a
                blast.inputs.left = 1;
                break;
            case 83: // s
                blast.inputs.down = 1;
                break;
            case 68: // d
                blast.inputs.right = 1;
                break;
            case 38: // up arrow
                blast.inputs.up = 1;
                break;
            case 37: // <--
                blast.inputs.left = 1;
                break;
            case 40: // down arrow
                blast.inputs.down = 1;
                break;
            case 39: // -->
                blast.inputs.right = 1;
                break;
            default:

        }
    },
    btnUp: function(e){
        switch(e.keyCode){
            case 87: // w
                blast.inputs.up = 0;
                break;
            case 65: // a
                blast.inputs.left = 0;
                break;
            case 83: // s
                blast.inputs.down = 0;
                break;
            case 68: // d
                blast.inputs.right = 0;
                break;
            case 38: // up arrow
                blast.inputs.up = 0;
                break;
            case 37: // <--
                blast.inputs.left = 0;
                break;
            case 40: // down arrow
                blast.inputs.down = 0;
                break;
            case 39: // -->
                blast.inputs.right = 0;
                break;
            default:
                
        }
    },
    mouseDown: function(e){
        blast.inputs.mouse = 1;
    },
    mouseUp: function(e){
        blast.inputs.mouse = 0;
    },
    canvasParent: null,
    mouseMove: function(e){
        blast.inputs.x = e.pageX - blast.canvasParent.offsetLeft;
        blast.inputs.y = e.pageY - blast.canvasParent.offsetTop;
    },
    inputs: {
        left: 0,
        up: 0,
        right: 0,
        down: 0,
        mouse: 0,
        x: 0,
        y: 0
    },
    zoomableSettings: [
        "gunInaccuracy",
        "laserSpeed",
        "laserSize",
        "shipSightRange",
        "shipFireRange",
        "shipPressureRange",
        "shipFleeRange",
        "shipBattleRange",
        "shipBattleComfort",
        "shipIdle",
        "shipChase",
        "shipDodgeRange",
        "shipSize"
    ],
    settings: {
        // all time-related figures are in ms

        // draws AI debug lines
        debug: false,

        // enables or disables FPS Compensation
        // prevents ships from moving and thinking too quickly/slowly on high/low framerates
        fpsCompensation: true,

        // enable or disable the player
        player: true,

        // false = black background
        // true = transparent background
        noBackground: false,
        zoom: 1,

        // shots before reloading
        gunAmmo: 5,
        // time between shots
        gunDelay: 500,
        // time it takes to reload
        gunReload: 2000,
        // the higher this number, the more inaccurate the AI is
        gunInaccuracy: 16,

        // speed of the laser
        laserSpeed: 10,
        // width of the laser (cosmetic)
        laserSize: 3,
        // color of the laser
        laserColor: "#F00",
        // lasers will connect at twice their length to look better
        // when 60fps gameplay is recorded at 30fps
        lowFpsLasers: false,

        // number of AI ships
        shipCount: 2,
        // how far ships can spot enemies
        shipSightRange: 700,
        // how far ships can fire at enemies
        shipFireRange: 600,
        // ships will try to maintain this distance during combat
        shipBattleRange: 300,
        // the shipBattleRange area is this size
        shipBattleComfort: 40,
        // a ship with high health can pressure enemies by closing to this range
        shipPressureRange: 150,
        // this is the chance per frame that a ship with high health will pressure enemies
        shipPressureChance: 0.0005,
        // a ship with very low health will flee to this distance from target
        shipFleeRange: 550,
        // how much damage a ship can withstand
        shipHealth: 10,
        // size of ships
        shipSize: 32,
        // random "wiggle" in different AI actions - idle wandering, dodging, battling
        shipWander: 10,
        // speed the AI travels while idle wandering
        shipIdle: 3,
        // speed the AI travels during combat
        shipChase: 6,
        // the AI will dodge lasers that come within this distance
        shipDodgeRange: 100,
        // it takes this long to come back after being killed
        shipRespawn: 5000,
        // the AI will change directions if it's been dodging the same direction for this long
        dodgeTime: 1000,

        // label health and ammo above ships
        shipLabels: true,
        scoreboard: true

    },
    ships: {},
    totalShips: 0,
    lasers: {},
    totalLasers: 0,

    piBy180: Math.PI / 180,
    _180ByPi: 180 / Math.PI,
    deg2rad: function(deg){
        return deg * this.piBy180;
    },
    rad2deg: function(rad){
        return rad * this._180ByPi;
    }
};

// load settings from url
var params = window.location.href;
if(params.indexOf("?") !== -1){
    params = params.split("?");
    params.shift();
    params = params.join("?");
    params = params.split("&");
    for(var i = 0; i < params.length; i++){
        params[i] = params[i].split("=");
        var key = params[i].shift();
        params[i] = [key, params[i].join("=")];
    }
    for(var i in params){
        if(params[i][0].length > 0 && params[i][1].length > 0){
            var setValue = params[i][1];
            if(setValue === "true"){
                setValue = true;
            }else if(setValue === "false"){
                setValue = false;
            }else if(parseFloat(setValue) == setValue){
                setValue = parseFloat(setValue);
            }
            blast.settings[params[i][0]] = setValue;
        }
    }
}

if(blast.settings.zoom !== 1){
    for(var i in blast.zoomableSettings){
        blast.settings[blast.zoomableSettings[i]] *= blast.settings.zoom;
    }
}

// set up canvas and etc
var canvasElement = document.getElementById("cnv");
var canvas = canvasElement.getContext("2d");
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;
var size = [window.innerWidth, window.innerHeight];
function doFrame(){
    if(size[0] !== window.innerWidth || size[1] !== window.innerHeight){
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
        size[0] = window.innerWidth;
        size[1] = window.innerHeight;
        blast.sizechange();
    }
    blast.frame();
    requestAnimationFrame(doFrame);
}
if(blast.settings.noBackground){
    canvasElement.style.background = "transparent";
    canvasElement.style.filter = "drop-shadow(0 0 5px #000)"
    document.body.style.background = "transparent";
    document.body.parentNode.style.background = "transparent";
}
document.body.addEventListener("keydown", blast.btnDown);
document.body.addEventListener("keyup", blast.btnUp);
blast.start();
requestAnimationFrame(doFrame);