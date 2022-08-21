import React, {forwardRef, useEffect, useRef, useState, ReactNode, ReactElement, FC} from 'react'
import './scss/PopContent.scss';

type Props = {
  open?: boolean;
  type?: 'table' | 'div';
  row?: (ReactElement<any> | string)[];
  openButton?: ReactElement<any> | string;
  label?: {
    open: ReactElement<HTMLOrSVGImageElement> | string
    closed: ReactElement<HTMLOrSVGImageElement> | string
  } | ReactElement<HTMLOrSVGImageElement> | string;
  onOpen?: (open: boolean) => void;
  openOnClick?: boolean;
  direction: 'vertical' | 'horizontal'
}

/**
 * PopContent is a component that does a single task, and does it well; provides a content reveal on click of the primary element (or whenever you choose, really)
 * @param type: PopContent can either be used as a div element or as a pair of table rows, for your table needs.
 */

export const PopContent = forwardRef( ({open, type = 'div', row, openButton, onOpen, openOnClick = open === undefined, }: Props, ref) => {
  const [elemOpen, setOpen] = useState(open)
  const details: React.MutableRefObject<null | HTMLDivElement | HTMLTableRowElement> = useRef(null)

  useEffect(() => {
    if (open !== elemOpen){
      setOpen(open)
      onOpen && onOpen(!!open)
    }
  }, [open])

  useEffect(() => {
    onOpen && onOpen(!!elemOpen)
  }, [elemOpen])

	componentDidUpdate(prevProps, prevState){
		const {open, horizontal} = this.props;
		if (prevProps.open !== open){
			this.setState({open})
		}
		if (this.props.children !== prevProps.children || this.state.open !== prevState.open){
			this.setState({
				dimensions: {
					width: (this.state.open || !horizontal) && this.detailsContent.current ? this.detailsContent.current.scrollWidth : 0, 
					height: (this.state.open || horizontal) && this.detailsContent.current ? this.detailsContent.current.scrollHeight : 0
				}
			})
		}
	}

	useEffect({
		const {open, horizontal} = this.props;
		this.setState({
			dimensions: {
				width: (this.state.open || !horizontal) && this.detailsContent.current ? this.detailsContent.current.scrollWidth : 0, 
				height: (this.state.open || horizontal) && this.detailsContent.current ? this.detailsContent.current.scrollHeight : 0
			}
		})
		this.setState({open})
	}, [])

	const clickedOutside = () => {
		this.onTimeout = setTimeout(() => {
			if (this.clickedContent){
				this.clickedContent = false;
			}
			else {
				this.openChange(false);
			}
		})
	}

	const openChange = open => {
		const {onChange, onOpen, onClose, keepOpen} = this.props;
		if (this.state.open !== open){
			if (onChange){
				onChange(open);
			}
			if (open){
				if (onOpen) {
					onOpen();
				}
				if (!keepOpen){
					document.addEventListener('click', this.clickedOutside)
				}
			}
			else {
				if (onClose){
					onClose();
				}
				if (!keepOpen){
					document.removeEventListener('click', this.clickedOutside)
				}
			}
			this.setState({open})
		}
	}
		const {className, children, label, icon, horizontal} = this.props;
		return (
			type === 'table'
      ? <tr>
        
      </tr>
      : <div ref={this.props.elemRef} className={filterJoin(["svz-pc-container",['active', open], className])}>
				<div className = "svz-pc-title-container" id={id} onClick={() => this.openChange(!open)}>
					{label.map ? label.map((content, index) => <div className="svz-pc-title" key = {id + index} >{content}</div>) : <div className ="svz-pc-title">{label}</div>}
					<div className="svz-pc-icon">{icon ? (open ? icon.open : icon.closed) : null}</div>
				</div>
				<div className={filterJoin(["svz-pc-details-container", ['horizontal', horizontal]])} onClick={() => this.clickedContent = true } 
					style={this.state.dimensions}
				>
					<div className="svz-pc-details" ref={this.detailsContent}>
						{children}
					</div>
				</div>
			</div>
      
		)