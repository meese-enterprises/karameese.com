<!DOCTYPE html>
<html>
    <head>
        <!--

            on your own apps, use this line instead:
            <script defer src="https://aaronos.dev/AaronOS/devTools.js"></script>

            -->
        <script defer src="devTools.js"></script>
        <script defer>
            // this function will be grabbed by devTools and run on connection with the website
            window.devTools_connectListener = function(){
                // enable padding on the app's window
                // (in the case of this app, we want some padding, but this is up to your own discretion)
                devTools.enablePadding();

                // open your app's window (if your app uses manualOpen)
                devTools.openWindow();

                document.getElementById("notconnected").style.display = "none";
            }
            // if devTools was already initialized by the time this script is running
            if(typeof devTools === "object"){
                // have devTools reinitialize itself
                devTools.testConnection();
            }
        </script>
    </head>
    <body>
        <div class="winHTML">
            <h1>Test Page</h1>
            <p>devTools is<span id="notconnected" style="color:red"> not</span> connected!</p>
            <p>
                <input placeholder="Input Field"><br><br>
                <button>Button</button>
            </p>
        </div>
    </body>
</html>