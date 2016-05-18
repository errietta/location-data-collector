function prepareQR() {
    console.log('1');
    w69b.qr.decoding.setWorkerUrl('/js/components/barcode.js/w69b.qrcode.decodeworker.min.js');
    console.log('2');
    var scanner =  new w69b.qr.ui.ContinuousScanner();
    // Called when a qr code has been decoded.
    console.log('3');
    scanner.setDecodedCallback(function(result) {
        console.log('Decoded qr code:', result);
        alert(result);
    });

    scanner.render(document.getElementById('cam'));
    console.log('4');
}

prepareQR();
