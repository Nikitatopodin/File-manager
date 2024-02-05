## Double path realization
To use commands which require two paths(e.g. path_to_file, path_to_destination) have to be covered with double quotes(");
For example, **mv "/dir/text.txt" "../"**. 
But, as far as I know, this approach is not good enough for Linux, since you can have double quotes in path/folder names.

Using double quotes for single path commands(e.g. *cat*, *add*, *rm* etc.) is not required.

## App origin
This app was created on Windows, so I'm not sure if it would correctly on another OS.