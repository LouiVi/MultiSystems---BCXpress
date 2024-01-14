// Assuming you have an image file path stored in the variable 'imageFilePath'

// Read the image file as a byte array
var file = app.ReadFile(imageFilePath);
var byteArray = file.ReadArrayBuffer();

// Open the SQLite database
var db = app.OpenDatabase("your_database_name.db");

// Prepare the SQLite statement to insert the image
var stmt = db.Prepare("INSERT INTO Products (Image) VALUES (?)");

// Bind the byte array to the statement
stmt.BindBlob(1, byteArray);

// Execute the statement to insert the image
stmt.Execute();

// Close the statement and the database
stmt.Close();
db.Close();


// Assuming you have the new image file path stored in the variable 'newImageFilePath'
// and the corresponding row ID of the image you want to update stored in the variable 'rowId'

// Read the new image file as a byte array
var newFile = app.ReadFile(newImageFilePath);
var newByteArray = newFile.ReadArrayBuffer();

// Open the SQLite database
var db = app.OpenDatabase("your_database_name.db");

// Prepare the SQLite statement to update the image
var stmt = db.Prepare("UPDATE Products SET Image = ? WHERE ProductName = ?");

// Bind the new byte array and the row ID to the statement
stmt.BindBlob(1, newByteArray);
stmt.Bind(2, rowId);

// Execute the statement to update the image
stmt.Execute();

// Close the statement and the database
stmt.Close();
db.Close();
