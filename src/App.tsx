import { MouseEvent, useEffect, useRef, useState, FC, LegacyRef, ReactElement} from 'react'
import './scss/PopContent.scss';

/**
 * PopContent is a component that does a single task, and does it well; provides a content reveal on click of the primary element (or whenever you choose, really)
 * @param type: PopContent can either be used as a div element or as a pair of table rows, for your table needs.
 */

const PopContent: FC<{
	summary?: ReactElement, 
	open?: boolean,
	onClick?: (evt: MouseEvent<HTMLTableRowElement> | MouseEvent<HTMLDivElement>) => void,
	onToggle?: (open: boolean) => void;
	// closeOnMouseOut?: boolean;
	noCloseOnOutsideClick?: boolean;
	children: ReactElement
	openDirection?: 'down' | 'up' | 'left' | 'right';
}>= ({summary, onClick, open: propOpen = false, onToggle, /* closeOnMouseOut, */ noCloseOnOutsideClick, openDirection = 'down', children}) => {
	const [open, setOpen] = useState(propOpen)
	const [dimensions, setDimensions ] = useState<{x: number, y: number}>({x: 0, y: 0})
	const details = useRef<HTMLDivElement | HTMLTableRowElement>(null)
	const activate = useRef<HTMLDivElement | HTMLTableRowElement>(null)
	const inside = useRef({activate: false, details: false});
	const timer = useRef<NodeJS.Timeout>()
  	

	const doDimensions = () => {
		const maxHeight: number = children.type === 'tr'
			? details.current ? 1 : 0
			: details.current?.scrollHeight || 0;
		const maxWidth: number = details.current?.scrollWidth || 0;
		setDimensions({
			x: ['left', 'right'].includes(openDirection) && open && maxWidth || 0, 
			y: ['up', 'down'].includes(openDirection) && open && maxHeight || 0
		})
	}

	useEffect(() => {
		setOpen(propOpen)
	}, [propOpen])

	useEffect(() => {
    	onToggle?.(open)
		doDimensions()
	}, [open, onToggle])

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
	const enteredDetails = () => {
		inside.current.details = true;
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
			// if (closeOnMouseOut){
			// 	inside.current.activate && activate.current?.addEventListener('mouseleave', leftActivate)

			// }
		}
		return () => {
			if (open){
				noCloseOnOutsideClick && document.removeEventListener('click', checkToCloseOnClick)
				// if (closeOnMouseOut){
				// 	activate.current?.removeEventListener('mouseleave', leftActivate);
				// 	details.current?.removeEventListener('mouseleave', leftDetails);
				// }
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
		return t?.type === 'tr'
			? <tr
				{...props}
				ref={details as LegacyRef<HTMLTableRowElement>}
				style={{lineHeight: dimensions.y}}
			>
				{t.props.children?.type === 'td' || t.props.children?.some?.((child: ReactElement) => child?.type === 'td') ? t.props.children : <td>{t.props.children}</td>}
			</tr>
			: <div
				{...props}
				ref={details as LegacyRef<HTMLTableRowElement>}
				style={{height: dimensions.y, width: dimensions.x}}
			>
				<div className='svz-pc-details'>{t.props.children || t}</div>
			</div>
	}
	
	const summ: (included?: JSX.Element) => JSX.Element | null = (included) => {
		if (!summary){
			return null
		}
		const props = {
			className: 'svz-pc-summary',
			style: {height: dimensions.y, ...(dimensions.x === null ? {} : {width: dimensions.x})},
			onClick: handleClick
		}
		const value = summary?.type === 'tr'
		? <tr
			{...props}
			ref={activate as LegacyRef<HTMLTableRowElement>}
		>
			{summary.props?.children}
		</tr>
		: <div
			ref={activate as LegacyRef<HTMLDivElement>}
		>
			{summary.props?.children || summary}
		</div>

		return value;
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

export const PopRow: FC<{
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
		return <PopContent summary={summary} {...props}>{children}</PopContent>
	}
	if (details) {
		return <PopContent summary={make(children) as ReactElement} {...props}>{make(details) as ReactElement}</PopContent>
	}
	return made
}

export const Accordion = PopContent

export default PopContent