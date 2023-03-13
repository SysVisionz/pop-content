/// <reference types="react-scripts" />
declare module '*.scss';
declare type AccordionProps = {
	summary?: ReactElement | string | number, 
	open?: boolean,
	onClick?: (evt: MouseEvent<HTMLTableRowElement> | MouseEvent<HTMLDivElement>) => void,
	onToggle?: (open: boolean) => void;
	closeOnMouseOut?: boolean;
	closeOnClick?: boolean;
	keepOpen?: boolean;
	children: ReactElement | string | number | ReactElement[]
	openDirection?: 'down' | 'up' | 'left' | 'right';
    style: {open: string, summary: string, details: string}
}

declare type AccordionRowProps = {
	details?: ReactElement | string | number, 
	open?: boolean,
	onClick?: (evt: MouseEvent<HTMLTableRowElement> | MouseEvent<HTMLDivElement>) => void,
	onToggle?: (open: boolean) => void;
	closeOnMouseOut?: boolean;
	keepOpen?: boolean;
	/** AccordionRow.children can use two formats.
	 * \<tr\>{activating row content}\</tr\>
	 * \<tr\>{details row content}\</tr\>
	 * 
	 * or simply as the content of the activating row.
	 * 
	 * \<td\>{cell content}\</td\>\<td\>{cell content}\</td\> ...
	 */
	children: ReactElement | string | number | ReactElement[]
	openDirection?: 'down' | 'up' ;
    style: {open: string, summary: string, details: string}
}