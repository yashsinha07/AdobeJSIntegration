#include json2.js
 
var input = loadJSON('input.json');

var doc = app.activeDocument;

//Changing App Name in a Text Layer
var layer9 = doc.layerSets.getByName('Layer 9');
var appNameText = layer9.layers[1];
appNameText.textItem.contents = input.appName;

//Changing Developer Name in a Text Layer
// var developerNameText = layer9.layers[0];
// developerNameText.textItem.contents = input.developerName;

//Changing Store Name in a Text Layer
// var layer3 = doc.layerSets.getByName('Layer 3');
// var storeNameText = layer3.layers[0];
// storeNameText.textItem.contents = input.storeName;

//Changing CTA Text in a Text Layer
// var layer4 = doc.layerSets.getByName('Layer 4');
// var ctaText = layer4.layers[0];
// ctaText.textItem.contents = input.ctaText;

//App Image
// var appImage = doc.layerSets.getByName('Layer 1').layers[0];
// var appImageURL = input.screenshotUrl[0];
// var downloadedAppImagePath = "/Users/yashsinha/Downloads/app-image.jpg";
// app.system("curl -o " + downloadedAppImagePath + " " +  appImageURL)

// Download the image
var imageURL = input.iconUrl;
var downloadedImagePath = "/Users/yash.sinha/Downloads/icon.png";
app.system("curl -o " + downloadedImagePath + " " +  imageURL);

//Place the app icon
place_image_here(downloadedImagePath, doc);
translate_layer(1804, 2390);

//Place the app image
// place_image_here(downloadedAppImagePath, doc);
// translate_layer(10, 0);

//Saving the template in JPEG Format
saveJpeg(input.appName);


//----------------------- FUNCTIONS -----------------------

//Load JSON
function loadJSON(relPath){
    var script = new File($.fileName);
    var jsonFile = new File(script.path + '/' + relPath);

    jsonFile.open('r');
    var str = jsonFile.read();
    jsonFile.close();

    return JSON.parse(str);
}

//Save JPEG
function saveJpeg(name){

    var file = new File(app.activeDocument.path + '/' + name + '.jpg');

    var opts = new JPEGSaveOptions();
    opts.quality = 10;                  //High quality JPEG save

    app.activeDocument.saveAs(file, opts, true, Extension.LOWERCASE);
}

//Placing the Image at the Icon Position
function place_image_here(fromimage, toimage)
{
  var fileRef = new File(fromimage);

  // If it's there, open it!
  if (fileRef.exists)
  {
    //Resize the image to the size of the logo icon
    resizeImage(fileRef);

    app.open(fileRef);

    // Establish the newly opened doc
    // is the from document
    var fromDocName = app.activeDocument.name;

    // Get the name of the destination image
    var toImageName = toimage.name;

    // Establish the from and to documents
    var to = app.documents.getByName(toImageName);
    var from = app.documents.getByName(fromDocName);

    // Select the tempImage
    app.activeDocument = from;

    // Move from tempImage to the baseImage
    var duplicateLayer = activeDocument.activeLayer.duplicate(to.layerSets.getByName('Layer 6'));

    // Close the temp image without saving
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
  else
  {
    alert("Error opening\n" + fromimage);
  }
}




//TRANSLATE LAYER(dx, dy)
function translate_layer(dx,dy)
{
  // =======================================================
  var id2014 = charIDToTypeID( "Trnf" );
  var desc416 = new ActionDescriptor();
  var id2015 = charIDToTypeID( "null" );
  var ref287 = new ActionReference();
  var id2016 = charIDToTypeID( "Lyr " );
  var id2017 = charIDToTypeID( "Ordn" );
  var id2018 = charIDToTypeID( "Trgt" );
  ref287.putEnumerated( id2016, id2017, id2018 );
  desc416.putReference( id2015, ref287 );
  var id2019 = charIDToTypeID( "FTcs" );
  var id2020 = charIDToTypeID( "QCSt" );
  var id2021 = charIDToTypeID( "Qcsa" );
  desc416.putEnumerated( id2019, id2020, id2021 );
  var id2022 = charIDToTypeID( "Ofst" );
  var desc417 = new ActionDescriptor();
  var id2023 = charIDToTypeID( "Hrzn" );
  var id2024 = charIDToTypeID( "#Pxl" );
  desc417.putUnitDouble( id2023, id2024, dx );
  var id2025 = charIDToTypeID( "Vrtc" );
  var id2026 = charIDToTypeID( "#Pxl" );
  desc417.putUnitDouble( id2025, id2026, dy );
  var id2027 = charIDToTypeID( "Ofst" );
  desc416.putObject( id2022, id2027, desc417 );
  executeAction( id2014, desc416, DialogModes.NO );
}

//Resize the image to the appropriate icon size
function resizeImage(imageFile){
    
    app.open(imageFile);
    doc = app.activeDocument;

    // change the color mode to RGB.  Important for resizing GIFs with indexed colors, to get better results
    doc.changeMode(ChangeMode.RGB);  

    // these are our values for the END RESULT width and height (in pixels) of our image
    var fWidth = 1159;
    var fHeight = 1159;

    // do the resizing.  if height > width (portrait-mode) resize based on height.  otherwise, resize based on width
    doc.resizeImage(UnitValue(fWidth,"px"),UnitValue(fHeight,"px"),null,ResampleMethod.BICUBIC);

    // Convert the canvas size as informed above for the END RESULT
    app.activeDocument.resizeCanvas(UnitValue(fWidth,"px"),UnitValue(fHeight,"px"));
}