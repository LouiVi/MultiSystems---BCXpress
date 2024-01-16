"use strict"

//Create a Home object.
function Home( path, layContent )
{
		var self = this;
		var color = utils.RandomHexColor(false);
    //Get page states.
    this.IsVisible = function() { return lay.IsVisible() }
    this.IsChanged = function() { return false }
    
    //Show or hide this page.
    this.Show = function( show )
    {
        if( show ) lay.Animate("FadeIn");
        else lay.Animate( "FadeOut" );
    }
    
    this.img_OnTouch = function ()
		{
		cam.SetFocusMode( "macro" );
		app.ShowProgress( "Scanning Barcode" );
				//utils.Alert("Todo");
				//app.SetOrientation( "Landscape" );
				self.DecodeFromCamera();
				setTimeout(()=>{app.HideProgress();},1974)
		}
		this.Txt = function (str)
{
	txtLoc.SetText(str);
}
this.GetTxt = function ()
{
	return txtLoc.GetText();
}


		this.ChangeBorderColor = function ()
{
//alert(self.GetColor());
	var rn = utils.RandomIntegerRange(1,3);
	if(rn==1) layScan.SetBackColor( self.GetColor() );//, app.ShowPopup( self.GetColor() );
	if(rn==2) layScan.SetBackColor( utils.GetGradientColors(self.GetColor() )[0]);//, app.ShowPopup( utils.GetGradientColors(self.GetColor() )[0]);
	if(rn==3) layScan.SetBackColor( utils.GetGradientColors(self.GetColor() )[1]);//, app.ShowPopup( utils.GetGradientColors(self.GetColor() )[1]);
	//app.ShowPopup( self.GetColor() );
}

this.GetColor = function ()
{
	return color;
}

//Callback to show errors.  
this.OnError = function( msg )   
{  
    app.Alert( "Error: " + msg )  
    console.log( "Error: " + msg )  
}  

this.cam_OnReady = function()
{
  cam.StartPreview();
  app.HideProgress();
  //cam.SetFocusMode( "macro" );
  
}

this.cam_Focus = function ()
{
	
}

this.DecodeFromCamera = function()
{
  var result = reader.Decode( cam );

  if( result != null )
  {
  app.OpenUrl( "https://barcodelookup.com/" + result.content );
    scanCapture.SetText( result.barcodeType + ": " + result.content );
    app.HideProgress();
    var db = app.OpenDatabase( "BCXpress.sqlite");///*app.GetInternalFolder() + */"/storage/emulated/0/northwindEF.db");// + "BCXpress.sqlite" )  
    //db.ExecuteSql("DROP TABLE Products");
     //db.ExecuteSql( "CREATE TABLE Products IF NOT EXIST (Id INTEGER PRIMARY KEY AUTOINCREMENT, ProductName VARCHAR NOT NULL, BarCodeFormat VARCHAR NOT NULL, BarCodeData VARCHAR NOT NULL, Image BLOB);" )  
    var bl = utils.Confirm("Did you like to save the image of the scanned code?");
    var picName = app.GetAppPath()+"/Img/"+ utils.Prompt("Enter the file name:","")+".png";
    if(bl) cam.TakePicture(picName );
    //picName = picName.replace("/sdcard/","/data/user/0/com.smartphoneremote.androidscriptfree/");
   // alert(picName);
    var im = app.CreateImage( picName,1,-1,"Resize");
    //lay.AddChild( im );
    //alert(im.data); 
    //var t = self.ImageToCanvas(im);
    //app.Wait( 2 );
    var imData = im.GetPixelData( "pngbase64",0,0,im.GetAbsWidth(),im.GetAbsHeight() );
    //var fileImg = app.ReadFile(picName);
//var byteArray =app.ReadFile(picName,"base64");// fileImg.ReadArrayBuffer();
//app.ReadFileData(  )
    //Add some data (with error handler).  
    bl = utils.Confirm("Did you like to save the record on the database?");
    if(bl) var  pName = prompt("Enter a name for the product:");
    if(bl) db.ExecuteSql( "INSERT INTO Products (ProductName, BarCodeData, BarCodeFormat,Image)" +   
        " VALUES (?,?,?,?)", [pName,result.content, result.barcodeType,imData], null, self.OnError )  
// Prepare the SQLite statement to update the image
//db.ExecuteSql("UPDATE Products SET Image = ? WHERE ProductName = ?" + " VALUES (?,?,?)", [);

// Bind the new byte array and the row ID to the statement
//stmt.BindBlob(1, byteArray);
//stmt.Bind(2, pName);

// Execute the statement to update the image
//stmt.Execute();

// Close the statement and the database
//stmt.Close();
db.Close();

app.HideProgress();
var file = "BCXpress.sqlite";
    app.SendMail( "luillosoftinc@gmail.com", "Data de BCXpress App", "Shared data from android app.", file )
app.SendMail( "luillosoftinc@gmail.com", "Foto de BCXpress App", "Shared data from android app.", picName )

    //app.WriteFile( file, "Hello World" );
    app.SendFile( file, "Shared File", app.GetUser() + " shared the sqlite database with you" );
  }

  setTimeout( self.DecodeFromCamera, 200 );
}

this.ImageToCanvas = function( image ) 
			{
				var width = image.width;
				var height = image.height;

				var canvas = document.createElement( 'canvas' );

				canvas.width = width;
				canvas.height = height;

				alert(canvas.toDataURL("image/png"));

				var context = canvas.getContext( '2d' );
				context.drawImage( image, 0, 0, width, height );

				return canvas;
			};

    
    //Create layout for app controls.
    var lay = app.CreateLayout( "Linear", "FillXY,VCenter" );
    lay.Hide();
    layContent.AddChild( lay );
    
    //var color = utils.RandomHexColor(false);
    var layScan = app.CreateLayout( "Card", "VCenter,HCenter" );
    layScan.SetBackColor( color );
    var i = utils.SetInterval(self.ChangeBorderColor,750);
    //layScan.SetBackGradient( color, utils.GetGradientColors(color )[0],utils.GetGradientColors(color)[1] );
    layScan.SetElevation( 15 );
    //layScan.SetGravity(45  );
   // layScan.SetSize( 0.3, 0.2  );
    layScan.SetCornerRadius( 12 );
    
    lay.AddChild( layScan );
    
    //Add a logo.
	var img = app.CreateImage( "Img/scan.png", 0.3, 0.2, "Button,VCenter,HCenter,FillXY" );
	img.SetOnTouch( self.img_OnTouch );
	
	//img.SetPadding(0.01, 0.01, 0.01, 0.01  );
	img.SetMargins( 0.01, 0.01, 0.01, 0.01 )
	img.SetLineWidth( 1 );
	//img.DrawRectangle( 0,0,0.25,-1 );
	img.SetBackGradient( color, utils.GetGradientColors(color )[0],utils.GetGradientColors(color)[1] );
	layScan.AddChild( img );
	
	//Create a text with formatting.
    var text = "<p><font color=" + color + "><big>Press the Button to Start Scanning</big></font></p>";// + 
    /*"Todo: Put your home page controls here! </p>" + 
    "<p>You can add links too - <a href=https://play.google.com/store>Play Store</a></p>" +
    "<br><br><p><font color=#4285F4><big><big><b>&larr;</b></big></big> Try swiping from the " + 
    "left and choosing the <b>'New File'</b> option</font></p>";*/
    var reader = app.CreateObject( "BarcodeReader" );

  var cam = app.CreateCameraView( 0.85, 0.25, "VGA, UseYUV" );
  cam.SetOnReady( self.cam_OnReady );
  cam.SetOnFocus( self.cam_Focus );

    var txt = app.CreateText( text, 1, -1, "Html,Link" );
    txt.SetPadding( 0.03, 0.03, 0.03, 0.03 );
    txt.SetTextSize( 13);
    txt.SetTextColor( "#444444" );
    lay.AddChild( txt );
    
    var txtLoc= app.CreateText( "", 1, -1, "Html,Link" );
    txtLoc.SetPadding( 0.03, 0.03, 0.03, 0.03 );
    txtLoc.SetTextSize( 8);
    txtLoc.SetTextColor( "#7169ef" );
    lay.AddChild( txtLoc );
    
      lay.AddChild( cam );
      var scanCapture = app.CreateTextEdit( "", 0.85, 0.1,"HCenter" );
      lay.AddChild(  scanCapture);
}