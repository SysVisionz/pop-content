# SysVisionz Accordion

This module provides four management classes for saving and retrieving objects, arrays, and all current javascript primitives into a named cookie without issue.

## Installation
To install, in terminal type

```
	npm i --save svz-accordion
```

then, in your project,

```
    import Accordion from 'svz-accordion';
```  

## Accordion
Accordion is pretty simple, but very versatile.  
  
**summary?: ReactElement | string | number | ReactElement[]**  
    This is the original activating element. A tr element will render as a table row, a div will render as that div, any other types will render as a div surrounding the element you provide. Leaving this undefined will make the accordion reliant on a change to the ** open ** prop to make it work. 
**open?: boolean**  
	This is the value for whether or not the accordion is open. Defaults to false.  
**onClick?: (evt: MouseEvent<HTMLTableRowElement> | MouseEvent<HTMLDivElement>) => void**  
	This is the function that will be run when you click on the activating element.  
**onToggle?: (open: boolean) => void**  
	This function will trigger any time open is toggled, and provides the new open value as its argument.  
**noCloseOnOutsideClick?: boolean**  
	If this is set to true, **open** will only be set to false if you click on the activating element. Otherwise, clicking outside the element will close it.
**children: ReactElement | string | number**  
	the children for this element will be what is rendered in the expanding component. If this is a tr style element, it will render as a table row and adjusts its styling appropriately so it still works in that format.  
**openDirection?: 'down' | 'up' | 'left' | 'right' **  
	This is the direction in which the children element will pop. If children is a tr element, only 'down' or 'up' are viable options.  

Additionally, the "AccordionRow" version can be used 

```
    import { AccordionRow } from 'svz-accordion';
```  

This is basically an assumed table row format, and the arguments change a little for ease of use.

**summary is removed.**

**children: ReactElement | string | number | ReactElement[]**  
	this element will actually be the original activating element. However, it can also be used in the format of an array of tr elements, which will render the first as the activating row and the second as the row revealed on click.
