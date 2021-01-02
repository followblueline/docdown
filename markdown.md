# Markdown


## Link

\[Google\]\(http://www.google.com\) renders as [Google](http://www.google.com)

Automatic links: simply surround the URL or email address with angle brackets which will create a clickable link.
&lt;http://www.google.com&gt;


### Internal documentation link

> **Internal docs link** written with `page#title_id`:  
> `[link](md_document.md#title_id)`  
> (title_id is visible with console inspector). Sample [internal link](sample.md#consoletool).


## Paragraph

Unless the paragraph is in a list, don’t indent paragraphs with spaces or tabs.  

|Markdown|Output|
|--|--|
|\# Heading 1  |Heading 1  |
|\#\# Heading 2  |Heading 2  |
|\#\#\# Heading 1  |Heading   |
|I just love \*\*bold text\*\*  |I just love **bold text** |
|I just love \_\_bold text\_\_  |I just love __bold text__ |
|I just love \*Italicized text\*  |I just love *Italicized text* |


##Blockquotes

To create a blockquote, add a > in front of a paragraph.

> Dorothy followed her through many of the beautiful rooms in her castle.
>
> Blockquotes can contain multiple paragraphs. Add a > on the blank lines between the paragraphs.
>
>> Blockquotes can be nested. Add a >> in front of the paragraph you want to nest.


## Lists

<table class="table table-bordered">
  <thead class="thead-light">
    <tr>
      <th>Markdown</th>
      <th>Rendered Output</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
          - First item<br>
          - Second item<br>
          - Third item<br>
          &nbsp;&nbsp;&nbsp;&nbsp;- Indented item<br>
          &nbsp;&nbsp;&nbsp;&nbsp;- Indented item<br>
          - Fourth item
      </td>
      <td>
        <ul>
          <li>First item</li>
          <li>Second item</li>
          <li>Third item
            <ul>
              <li>Indented item</li>
              <li>Indented item</li>
            </ul>
          </li>
          <li>Fourth item</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>
          1. First item<br>
          1. Second item<br>
          1. Third item<br>
          &nbsp;&nbsp;&nbsp;&nbsp;1. Indented item<br>
          &nbsp;&nbsp;&nbsp;&nbsp;1. Indented item<br>
          1. Fourth item
      </td>
      <td>
        <ul>
          <li>1. First item</li>
          <li>2. Second item</li>
          <li>3. Third item
            <ul>
              <li>1. Indented item</li>
              <li>2. Indented item</li>
            </ul>
          </li>
          <li>4. Fourth item</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>


## Code blocks

Code blocks are normally indented four spaces or one tab. When they’re in a list, indent them eight spaces or two tabs.

    [1,2,3].forEach( i => {
		console.log(i)
	});
	
Instead of using indentation, you can also create code blocks by using “code fences”, consisting of three or more backticks (```) or tildes (~~~):

<pre class="code">
&#96;&#96;&#96;
alert(false);
&#96;&#96;&#96;
</pre>

becomes

```
alert(false);
```

**Inline code**: Random sentence with `alert('foo');` inline code block.



## Horizontal rule

Use \-\-\- or \_\_\_ or \*\*\* to create HR:

---



## Image

`![Alt tekst](images/DSC06775.JPG)`
![Alt tekst](images/DSC06775.JPG)



## Inline HTML

<ol>
	<li>For more complex layout</li>
	<li>use html<br>
		Example <span class="code">var foo = bar</span> inline code<br>
		followed by <i>whole</i> <b>code</b> block:
<pre><code>// example
var a = 3;
var b = 4;
if (a != b) {
	// a != b
}</code></pre>
	Another inline <span class="code">code sample</span> in sentence.
	</li>
</ol>




# Other resources

- Online editors
    - [Stackedit](https://stackedit.io/app#)
    - [Dillinger](https://dillinger.io/)
- Markdown syntax
    - [markdown syntax](https://www.markdownguide.org/basic-syntax/)

