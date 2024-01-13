
  
function isValidFileName(str)
{
    return !/[/.`!#$%\^&*+=\[\]\\';,/{}|\\":<>\?]/g.test(str);
}

//Create help buttons.
function CreateHelpButton( lay, id )
{
    btnHelp = app.CreateButton( "[fa-question]", -1, 0.1, "FontAwesome" );
    btnHelp.help = id;
    btnHelp.SetSize( 40, 40, "dp" );
    btnHelp.SetTextSize( 12 );
    btnHelp.SetTextColor( "#4285F4" );
    btnHelp.SetOnTouch( btn_OnHelp );
    lay.AddChild( btnHelp );
    return btnHelp;
}

