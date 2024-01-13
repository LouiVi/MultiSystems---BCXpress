"use strict"

//Create an new file viewer object.
//(Note: a single instance of this object is used for all file data)
function File( path, layContent )
{
    var self = this;
    var name = "";
    var dfltImage = "Img/Icon.png";
    var dfltText = "";
    
    //Get page states.
    this.IsVisible = function() { return lay.IsVisible() }
    this.IsChanged = function() { return btnSave.IsEnabled() }
    
    //Show or hide this page.
    this.Show = function( show, title )
    {
        if( show ) 
        {
            name = title;
            self.Load();
            lay.Animate("FadeIn");
        }
        else lay.Animate( "FadeOut" );
    }
    
    //Load page settings from json file.
    this.Load = function()
    {
        //Read settings from json file.
        var file = path+"/"+name+"/"+name+".json";
        var json = app.ReadFile( file );
        
        if( json ) 
        {
            //Set controls.
            var data = JSON.parse(json);
            var dfltName = name ;
            img.SetImage( data.image ? data.image : dfltImage, img.GetWidth() );
            img.imageFile =  data.image ? data.image : dfltImage;
            
            txtNotes.SetText( data.text ? data.text : dfltText );
        }
        else self.Clear();
        
        btnSave.SetEnabled( false );
    }
    
    //Save page settings to json file.
    this.Save = function()
    {
        //Create settings object.
        var settings = 
        { 
            image : img.imageFile,
            text : txtNotes.GetText(),
        }
        
        //Write settings to file as json.
        var file = path+"/"+name+"/"+name+".json";
        app.WriteFile( file, JSON.stringify( settings ) );
        btnSave.SetEnabled( false );
    }
    
    //Clear page controls.
    this.Clear = function()
    {
        img.SetImage( dfltImage );
        img.imageFile =  dfltImage;
        
        txtNotes.SetText( dfltText );
    }
    
    //Swap image.
    this.OnImageChoose = function( file )
    {
        app.MakeFolder( path+"/"+name+"/Img" );
        var imageFile = path+"/"+name+"/Img/"+name+".png";
        app.GetThumbnail( file, imageFile, 340, 340 );
        img.SetImage( imageFile, 0.2,-1 );
        img.imageFile = imageFile;
        btnSave.SetEnabled( true );
    }
    
    //Handle image button.
    this.btnImage_OnTouch = function()
    {
        app.ChooseFile( "Choose Image", "image/*", self.OnImageChoose );
    }
    
    //Create layout for app controls.
    var lay = app.CreateLayout( "Linear", "FillXY,VCenter" );
    lay.Hide();
    layContent.AddChild( lay );
    
    //Create image label.
    var lab = app.CreateText( "Image" ); 
    lab.SetTextColor( "#4285F4" );
    lay.AddChild( lab );
    
    //Create horizontal layout.
    var layHoriz = app.CreateLayout( "Linear", "Horizontal" );
    layHoriz.SetMargins( 0, 0.02, 0, 0 );
    lay.AddChild( layHoriz );
    
    //Create a help button.
    btnHelp = CreateHelpButton( layHoriz, "image" );
    btnHelp.SetMargins( 0, 0.01, 0.14, 0 );
    
    //Create image.
	var img = app.CreateImage( dfltImage, 0.2, -1 );
	img.imageFile = dfltImage;
	layHoriz.AddChild( img );
	
	//Create a change image button.
    var btnImage = app.CreateButton( "[fa-refresh]", -1, 0.1, "FontAwesome" );
    btnImage.SetMargins( 0.08, 0.015, 0, 0 );
    btnImage.SetTextSize( 18 );
    btnImage.SetTextColor( "#555555" );
    btnImage.SetOnTouch( self.btnImage_OnTouch );
    layHoriz.AddChild( btnImage );
    
    //Create 'Notes' label.
    var lab = app.CreateText( "Notes" ); 
    lab.SetMargins( 0, 0.04, 0, 0 );
    lab.SetTextColor( "#4285F4" );
    lay.AddChild( lab );
    
    //Create help button.
    var layHoriz = app.CreateLayout( "Linear", "Horizontal" );
    lay.AddChild( layHoriz );
    btnHelp = CreateHelpButton( layHoriz, "notes" );
    btnHelp.SetMargins( 0, 0, 0.01, 0 );
    
    //Create notes edit control.
    var txtNotes = app.CreateTextEdit( "", 0.7 );
    txtNotes.SetOnChange( function(){btnSave.SetEnabled(true)} );
    layHoriz.AddChild( txtNotes );

    //Create a save button.
    var btnSave = app.CreateButton( "SAVE", 0.35, 0.1 );
    btnSave.SetMargins( 0,0.2,0,0 );
    btnSave.SetOnTouch( self.Save );
    lay.AddChild( btnSave );
}

//Show context help.
function btn_OnHelp()
{
    var txt = ""
    switch( this.help )
    {
        case "image": 
            txt = "This is a popup help box";
            app.ShowTip( txt, 0.25, 0.42); 
            break;
        case "notes": 
            txt = "This is where you type some notes etc...bla bla bla";
            app.ShowTip( txt, 0.15, 0.53 ); 
            break;
    }
}

