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

this.cam_OnReady = function()
{
  cam.StartPreview();
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
    scanCapture.SetText( result.barcodeType + ": " + result.content );
    app.HideProgress();
    var bl = utils.Confirm("Did you like to save the image of the scanned code?");
    if(bl) cam.TakePicture(app.GetAppPath()+"/Img/"+ utils.Prompt("Enter the file name:","")+".png" );
  }

  setTimeout( self.DecodeFromCamera, 200 );
}

    
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
    
      lay.AddChild( cam );
      var scanCapture = app.CreateTextEdit( "", 0.85, 0.1,"HCenter" );
      lay.AddChild(  scanCapture);
}