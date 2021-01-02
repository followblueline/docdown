# About

_Docdown_ is simple [Markdown](https://www.markdownguide.org/basic-syntax/) dokumentation generator.  
Multiple .md documents are loaded with _XMLHttpRequest_ and joined together, with menu automatically generated from H1, H2, H3 elements. 
MD text file is converted to html with [Showdown plugin](https://github.com/showdownjs/showdown).

In case more complex control is needed, html can be mixed with text.  
Sections and pages within documentation can be linked together with `[link](md_document.md#title_id)` format ([example](markdown.md#internaldocumentationlink)). 
Internal relative links are converted to absolute so they can be shared or opened in another tab.



## Dependencies

Docdown has [Showdown](https://github.com/showdownjs/showdown) and [jQuery](https://jquery.com/) dependency.


## Installation

Since .md files are loaded with _XMLHttpRequest_, simply place docdown in desired folder and run in web server. If browser is run with _allow file access from files_ flag to avoid CORS, it can be run through filesystem.  
Put .md files in root and load them through `docdown.run()` method in _index.html_ file:
```
$(function () {
	docdown.init({
		title: 'Docdown',
		version: '1.0',
		date: '22.12.2020',
		searchShowFragmentLength: 160, // how many characters are shown in search results
		disableForced4SpacesIndentedSublists: true,
		showdown: {
			// showdown config
			literalMidWordUnderscores: true,
			tables: true
		}
	});
	// load documents
	docdown.run([
		'info.md',
		'terms.md',
		'markdown.md',
		'sample.md'
	]);
});
```


## License

Docdown is released under the MIT version.


## Browser Compatibility

Docdown has been tested successfully with Firefox, Chrome and Edge.


## Extended documentation
Check docdown samples within package for examples and a more in-depth documentation.


## Options
You can change some of options in `docdown.init()` method in _index.html_ file.



