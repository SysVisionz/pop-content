import React, { MouseEvent, useEffect, useRef, useState, FC, LegacyRef, ReactElement} from 'react'
import './scss/Accordion.scss';

/**
 * Accordion is a component that does a single task, and does it well; provides a content reveal on click of the primary element (or whenever you choose, really)
 * Accordion can either be used as a div element or as a pair of table rows, for your table needs.
 */

const Accordion: FC<{
	summary?: ReactElement | string | number, 
	open?: boolean,
	onClick?: (evt: MouseEvent<HTMLTableRowElement> | MouseEvent<HTMLDivElement>) => void,
	onToggle?: (open: boolean) => void;
	closeOnMouseOut?: boolean;
	noCloseOnOutsideClick?: boolean;
	children: ReactElement | string | number
	openDirection?: 'down' | 'up' | 'left' | 'right';
}> = function({summary, onClick, open: propOpen = false, onToggle, closeOnMouseOut, noCloseOnOutsideClick, openDirection = 'down', children}) {
	const [open, setOpen] = useState(propOpen)
	const [dimensions, setDimensions ] = useState<{x: number, y: number}>({x: 0, y: 0})
	const details = useRef<HTMLDivElement | HTMLTableRowElement>(null)
	const activate = useRef<HTMLDivElement | HTMLTableRowElement>(null)
	const inside = useRef({activate: false, details: false});
	const timer = useRef<NodeJS.Timeout>()
	const prevElems = useRef<ResizeObserverEntry[]>()
  	
	const isTR = (typeof children === 'object' && children.type === 'tr') || typeof summary === 'object' && summary?.type === 'tr'

	const doDimensions = () => {
		const maxHeight: number = isTR
			? details.current ? 1 : 0
			: details.current?.scrollHeight || 0;
		const maxWidth: number = details.current?.scrollWidth || 0;
		setDimensions({
			x: isTR || ['up', 'down'].includes(openDirection) || open ? maxWidth : 0, 
			y: ['left', 'right'].includes(openDirection) || open ? maxHeight : 0
		})
	}

	useEffect(() => {
		setOpen(propOpen)
	}, [propOpen])

	useEffect(() => {
    	onToggle?.(open)
		doDimensions()
	}, [open, onToggle])

	useResize( details.current, (elems) => {
		let changed = false;
		const withinRange=(num1: number, num2: number, range: number) => Math.abs(num1 - num2) <= range;
		if (prevElems.current){
			for (const i in prevElems.current){
				const {contentRect} = prevElems.current[i]
				const {contentRect: newContentRect} = elems?.[i] || {}
				if (!withinRange(contentRect.height, newContentRect?.height || contentRect.height, 5) || !withinRange(contentRect.width, newContentRect?.width || contentRect.width, 5) ){
					changed = true;
				}
			}
		}
		prevElems.current = elems;
		if (changed) {
			doDimensions()
		}
	})

	const handleClick = (evt: MouseEvent<HTMLTableRowElement> | MouseEvent<HTMLDivElement> ) => {
		setOpen(!open);
		onClick?.(evt) 
	}

	const checkUp = (elem: any) => {
		elem.parentNode === document.body 
			? setOpen(false)
			: elem.parentNode !== details.current && checkUp(elem.parentNode);
	}

	const closeIfOut = () => {
		inside.current.details || inside.current.activate || setOpen(false)
		timer.current && clearTimeout(timer.current)
	}

	const leftActivate = () => {
		inside.current.activate = false;
		activate.current?.removeEventListener('mouseleave', leftActivate)
		timer.current = setTimeout(closeIfOut, 100)
	}
	const leftDetails = () => {
		inside.current.details = false;
		timer.current = setTimeout(closeIfOut, 100)
	}

	const checkToCloseOnClick = (evt: globalThis.MouseEvent) => {
		evt.stopPropagation();
		if (evt.target !== details.current){
			checkUp(evt.target);
		}
	}

	useEffect(() => {
		if (open){
			noCloseOnOutsideClick && document.addEventListener('click', checkToCloseOnClick)
			if (closeOnMouseOut){
				inside.current.activate && activate.current?.addEventListener('mouseleave', leftActivate)

			}
		}
		return () => {
			if (open){
				noCloseOnOutsideClick && document.removeEventListener('click', checkToCloseOnClick)
				if (closeOnMouseOut){
					activate.current?.removeEventListener('mouseleave', leftActivate);
					details.current?.removeEventListener('mouseleave', leftDetails);
				}
			}
		}
	})

	useEffect(() => {
		doDimensions()
	}, [])

	const child: (force?: JSX.Element) => JSX.Element = (force) => {
		const props = {
			className: `svz-pc-details-container${open ? " open" : ''}`,
		}
		const t = force || children
		return typeof t === 'object' ? 
			t?.type === 'tr'
				? <tr
					{...props}
					ref={details as LegacyRef<HTMLTableRowElement>}
					style={{lineHeight: dimensions.y}}
				>
					{t.props.children?.type === 'td' || t.props.children?.some?.((child: ReactElement) => child?.type === 'td') ? t.props.children : <td>{t.props.children}</td>}
				</tr>
				: <div
					{...props}
					style={{height: dimensions.y, width: dimensions.x}}
				>
					<div {...(t.type === 'div' ? {...t.props,
						ref: details as LegacyRef<HTMLDivElement>, 
						className: `svz-pc-details${t.props.className ? ` ${t.props.className}` : ''}`
					} : {className: `svz-pc-details${t.props.className ? ` ${t.props.className}` : ''}`})} >{t.type === 'div' ? t.props.children : t}</div>
				</div>
			: <div {...props} style={{height: dimensions.y, width: dimensions.x}}>
				<div ref={details as LegacyRef<HTMLDivElement>} className="svz-pc-details">{t}</div>
			</div>
	}
	
	const summ: () => JSX.Element | null = () => {
		if (!summary){
			return null
		}
		const props = {
			className: 'svz-pc-summary',
			onClick: handleClick
		}
		const value = typeof summary === 'object' 
			? summary?.type === 'tr'
				? <tr
					{...props}
					ref={activate as LegacyRef<HTMLTableRowElement>}
				>
					{summary.props?.children}
				</tr>
				: <div
					{...(summary.props.type === 'div' ? {...summary.props, ...props, ref: activate as LegacyRef<HTMLDivElement>} : {...props, ref: activate as LegacyRef<HTMLDivElement>})}
				>
					{summary.props.type === 'div' ? summary.props?.children : summary}
				</div>
			: <div ref={activate}>{summary}</div>

		return value;
	}
	if (typeof summary !== 'object'){
		summary = <div>{summary}</div>
	}
	if (typeof children !== 'object'){
		children = <div>{children}</div>
	}
	if ([summary?.type, children?.type].includes('tr') && summary?.type !== children?.type){
		if (children?.type === 'tr'){
			summary = <tr><td>{summary}</td></tr>
		}
		else {
			children = <tr><td>{children}</td></tr>
		}
	}

	return ['up', 'left'].includes(openDirection)
		? <>{child()}{summ()}</>
		: <>{summ()}{child()}</>
}

const AccordionRow: FC<{
	details?: ReactElement, 
	open?: boolean,
	onClick?: (evt: MouseEvent<HTMLTableRowElement> | MouseEvent<HTMLDivElement>) => void,
	onToggle?: (open: boolean) => void;
	closeOnMouseOut?: boolean;
	noCloseOnOutsideClick?: boolean;
	children: ReactElement | ReactElement[]
	openDirection?: 'down' | 'up' | 'left' | 'right';
}> = ({details, children, ...props}) => {
	const make = (elem: ReactElement | ReactElement[]): ReactElement | [ReactElement, ReactElement] => {
		return typeof elem === 'string' || typeof elem === 'number'
			? <tr><td>{elem}</td></tr>
			: elem instanceof Array
				? elem.length === 2 && elem.every(child => child.type === 'tr')
					? [make(elem[0]) as ReactElement, make(elem[1]) as ReactElement]
					: elem.every(child => child.type === 'td')
						? <tr>{elem}</tr>
						: <tr><td>{elem}</td></tr>
				: elem.type === 'tr'
					? make(elem.props.children)
					: <tr><td>{elem}</td></tr>
	}

	const made = make(children)
	if (made instanceof Array){
		const [summary, children] = made
		return <Accordion summary={summary} {...props}>{children}</Accordion>
	}
	if (details) {
		return <Accordion summary={make(children) as ReactElement} {...props}>{make(details) as ReactElement}</Accordion>
	}
	return made
}

const useResize = (element: Element | null | undefined , onResize: (entries?: ResizeObserverEntry[], observer?: ResizeObserver) => void, options?: ResizeObserverOptions & {delay?: number | null}) => {
	const resizeChecker = useRef<ResizeObserver | null>(null)
	const delay = useRef<NodeJS.Timeout | null>()
	const {delay: delayFor, ...resizeOptions} = options || {};
	useEffect(() => {
		let elem: unknown = element
		if (elem){
			if (!resizeChecker.current){
				resizeChecker.current = new ResizeObserver((entries, observer) => {
					if (!delay || !delayFor){
						onResize(entries, observer)
						delay.current = setTimeout(() => {
							delay.current = null;
						}, delayFor || 50)
					}
				})
			}
			resizeChecker.current.observe(elem as Element, resizeOptions)
		}
		return () => {
			resizeChecker.current?.unobserve(elem as Element)
		}
	})
}

export {Accordion as default, AccordionRow}