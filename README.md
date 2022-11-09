# SysVisionz Accordion

This module provides four management classes for saving and retrieving objects, arrays, and all current javascript primitives into a named cookie without issue.

## Installation
To install, in terminal type

```
	npm i --save svz-accordion
```

then, in your project,

```
    import Accordion, {AccordionRow} from 'svz-accordion';
```  

## Accordion
Accordion is pretty simple, but very versatile.  
  
** summary?: ReactElement **  
    This is the original activating element. A tr element will render as a table row, a div will render as that div, any other types will render as a div surrounding the element you provide. Leaving this undefined will make the accordion reliant on a change to the ** open ** prop to make it work. 
** open?: boolean **  
	This is the value for whether or not the accordion is open. Defaults to false.  
** onClick?: (evt: MouseEvent<HTMLTableRowElement> | MouseEvent<HTMLDivElement>) => void **  
	This is the function that will be run when you click on the activating element.  
** onToggle?: (open: boolean) => void **  
	This function will trigger any time open is toggled, and provides the new open value as its argument.  
** closeOnMouseOut?: boolean **  
	Setting this to true will cause the element to close on mouse out.
** noCloseOnOutsideClick?: boolean **  
	If this is set to true, **open** will only be set to false if you click on the activating element. Otherwise, clicking outside the element will close it.
** children: ReactElement **  
	the children for this element will be what is rendered in the expanding component. If this is a tr style element, it will render as a table row and adjusts its styling appropriately so it still works in that format.  
** openDirection?: 'down' | 'up' | 'left' | 'right' **  
	This is the direction in which the children element will pop. If children is a tr element, only 'down' or 'up' are viable options.  