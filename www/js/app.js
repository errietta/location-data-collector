document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    var imageFile;
    var position;
    var wifi;

    var errordiv = document.getElementById('error');

    document.getElementById('hide').addEventListener('click', function() {
        var div = document.getElementById('showd');
        div.style.display = 'none';
    });

    document.getElementById('show').addEventListener('click', function() {
        var div = document.getElementById('showd');
        var records = localStorage.getItem('records');

        console.log(records);

        if (!records) {
            records = [];
        } else {
            records = JSON.parse(records);
        }

        records.forEach(function(record) {
            div.innerHTML +=
            "<h3>Comment</h3>" +
            record.comment +
            (record.imageFile?
             "<img style='width:100%'  src='" + record.imageFile.fullPath + "' /><br/>":"") +
            (record.position?
             "<h3>Position</h3>" +
             JSON.stringify(record.position) + "<br/>":"") +
            (record.wifi?
             "<h3>Wifi</h3>" +
             JSON.stringify(record.wifi) + "<br/>":"") +
            "<hr />";
        });

        div.style.display = 'block';
    });

    document.getElementById('showJSON').addEventListener('click', function() {
        var div = document.getElementById('showd');
        var records = localStorage.getItem('records');

        div.innerHTML = records;
        div.style.display = 'block';
    });

    document.getElementById('email').addEventListener('click', function() {
        var records = localStorage.getItem('records');

        if (!records) {
            alert("No records!");
            return;
        }

        cordova.plugins.email.open({
            subject: 'Exported records',
            body:    records
        });
    });

    document.getItem('clearRecords').addEventListener('click', function() {
        if (confirm("Are you sure? This cannot be undone!")) {
            localStorage.setItem('records', '');
            window.location.reload();
        }
    });

    document.getElementById('submit').addEventListener('click', function() {
        var records = localStorage.getItem('records');

        if (!records) {
            records = [];
        } else {
            records = JSON.parse(records);
        }

        var comment = document.getElementById('comment');

        var obj = {
            imageFile: imageFile,
        position: position,
        wifi: wifi,
        time: new Date(),
        comment: comment.value
        };

        records.push(obj);
        localStorage.setItem('records', JSON.stringify(records));

        alert('Saved');
        window.location.reload();
    });

    // capture callback
    var captureSuccess = function(mediaFiles) {
        var len = mediaFiles.length;

        for (var i = 0; i < len; i ++) {
            var path = mediaFiles[i].fullPath;
            console.log(path);
            imageFile = mediaFiles[i];

            document.getElementById('img').style.display = 'block';
            document.getElementById('img').src = path;
        }
    };

    // capture error callback
    var captureError = function(error) {
        console.warn('Error code: ' + error.code, null, 'Capture Error');

        errordiv.innerHTML += "Capture error: " + JSON.stringify(error);
    };

    document.getElementById('image').addEventListener('click', function() {
        // start video capture
        navigator.device.capture.captureImage(captureSuccess, captureError);
    });

    var navSuccess = function(pos) {
        var str = ('Latitude: '          + pos.coords.latitude          + '\n' +
                'Longitude: '         + pos.coords.longitude         + '\n' +
                'Altitude: '          + pos.coords.altitude          + '\n' +
                'Accuracy: '          + pos.coords.accuracy          + '\n' +
                'Altitude Accuracy: ' + pos.coords.altitudeAccuracy  + '\n' +
                'Heading: '           + pos.coords.heading           + '\n' +
                'Speed: '             + pos.coords.speed             + '\n' +
                'Timestamp: '         + pos.timestamp                + '\n');

        console.log(str);
        document.getElementById('nav-txt').innerHTML = str;
        document.getElementById('nav-txt').value = str;

        position = pos;
    };

    // onError Callback receives a PositionError object
    //
    function navError(error) {
        console.warn('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');

        errordiv.innerHTML += "Nav error: " + JSON.stringify(error);
    }

    document.getElementById('nav').addEventListener('click', function() {
        console.log("?????");

        /* This can take forever and a day. */
        navigator.geolocation.getCurrentPosition(navSuccess, navError, { timeout: 60000 });
    });

    document.getElementById('wifi').addEventListener('click', function() {
        WifiWizard.startScan(function() {
            WifiWizard.getScanResults({},
                function(results) {
                    console.log(results);
                    wifi = results;
                    var str = JSON.stringify(results);

                    document.getElementById('wifi-txt').innerHTML = str;
                    document.getElementById('wifi-txt').value = str;
                },
                function(err) {
                    console.log(err);
                }
                );
        }, function(err) {
            console.log(err);
        });
    });
}


