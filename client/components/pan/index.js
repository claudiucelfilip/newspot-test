import React, { Component } from 'react';

export default class Pan extends Component {
    constructor() {
        super();

        this.state = {
            dragging: false,
            pointerTop: 0,
            pointerLeft: 0,
            panTop: 0,
            panLeft: 0,
            verticalDirection: 0
        };
    }

    componentDidMount() {
        // this.node.addEventListener('mousedown', this.wrapMouseEvent(this.handlePanStart), false);
        this.node.addEventListener('touchstart', this.wrapTouchEvent(this.handlePanStart), false);

        // this.node.addEventListener('mousemove', this.wrapMouseEvent(this.handlePanMove), false);
        this.node.addEventListener('mousewheel', this.wrapScrollEvent(this.handlePanMove), false);
	    this.node.addEventListener('DOMMouseScroll', this.wrapScrollEvent(this.handlePanMove), false);
        this.node.addEventListener('touchmove', this.wrapTouchEvent(this.handlePanMove), false);

        // this.node.addEventListener('mouseup', this.wrapMouseEvent(this.handlePanStop), false);
        this.node.addEventListener('touchend', this.wrapTouchEvent(this.handlePanStop), false);

        this.setState({
            pointerTop: this.node.offsetTop,
            pointerLeft: this.node.offsetLeft
        });
    }

    wrapTouchEvent(fn) {
        return (e) => {
            let posX = e.touches[0].clientX;
            let posY = e.touches[0].clientY;

            fn(e, posX, posY);
        }
    }

    wrapMouseEvent(fn) {
        return (e) => {
            let posX = e.x;
            let posY = e.y;

            fn(e, posX, posY);
        }
    }

    wrapScrollEvent(fn) {
        let posX = 0;
        let posY = 0;
        
        this.setState({
            dragging: false
        });

        return (e) => { 
            let maxDeltaX = this.props.blockWidth;
            let maxDeltaY = this.props.blockHeight;

            let deltaXSign = e.deltaX < 0 ? -1 : 1;
            let deltaYSign = e.deltaY < 0 ? -1 : 1;
            
            posX -= Math.abs(e.deltaX) > maxDeltaX ? maxDeltaX * deltaXSign : e.deltaX;
            posY -= Math.abs(e.deltaY) > maxDeltaY ? maxDeltaY * deltaYSign : e.deltaY;

            fn(e, posX, posY, true);
        }
    }

    handlePanStart = (e, posX, posY) => {
        this.setState({
            dragging: true,
            pointerLeft: posX,
            pointerTop: posY,
        });
        e.preventDefault();
    }

    handlePanMove = (e, posX, posY, forceDragg) => {
        if (this.state.dragging || forceDragg) {
            let diffLeft = posX - this.state.pointerLeft;
            let diffTop = posY - this.state.pointerTop;

            let newPanLeft = this.state.panLeft + diffLeft;
            let newPanTop = this.state.panTop + diffTop;

            let isOutsideLeft = newPanLeft > 0;
            let isOutsideTop = newPanTop > 0;

            
            let isOutsideRight = newPanLeft + this.props.width < this.props.containerWidth;
            let isOutsideBottom = newPanTop + this.props.height < this.props.containerHeight;

            let verticalDirection = diffTop < 0 ? -1 : 1;
            verticalDirection = diffTop === 0 ? 0 : verticalDirection; 

            this.setState({
                pointerLeft: posX,
                pointerTop: posY,
                verticalDirection,
                panLeft: !isOutsideLeft && !isOutsideRight ? newPanLeft : this.state.panLeft,
                panTop: !isOutsideTop ? newPanTop : this.state.panTop,
            });

            e.preventDefault();
        }
    }

    handlePanStop = (e, posX, posY) => {
        this.setState({
            dragging: false,
            pointerLeft: posX,
            pointerTop: posY
        });
        e.preventDefault();
    }

    render() {
        let style = {
            transform: `translate(${this.state.panLeft}px, ${this.state.panTop}px)`,
            background: 'red'
        };

        let children = this.props.children.map(child => {
            return React.cloneElement(child, {
                ...child.props,
                panTop: this.state.panTop,
                panLeft: this.state.panLeft,
                verticalDirection: this.state.verticalDirection,
                blockWidth: this.props.blockWidth,
                blockHeight: this.props.blockHeight,
                containerWidth: this.props.containerWidth,
                containerHeight: this.props.containerHeight
            });
        })
        return <div className="pan" ref={node => this.node = node} style={style}>
            {children}
        </div>;
    }
}