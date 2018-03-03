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
        this.node.addEventListener('mousedown', this.handlePanStart);
        this.node.addEventListener('touchstart', this.handlePanStart);

        this.node.addEventListener('mousemove', this.handlePanMove);
        this.node.addEventListener('touchmove', this.handlePanMove);

        this.node.addEventListener('mouseup', this.handlePanStop);
        this.node.addEventListener('touchend', this.handlePanStop);

        this.setState({
            pointerTop: this.node.offsetTop,
            pointerLeft: this.node.offsetLeft
        });
    }

    handlePanStart = (e) => {
        console.log('Pan Start', e);

        let posX = e.x;
        let posY = e.y;

        if (e.type === 'touchstart') {
            posX = e.touches[0].clientX;
            posY = e.touches[0].clientY;
        }
            
        this.setState({
            dragging: true,
            pointerLeft: posX,
            pointerTop: posY,
        });
        
    }

    handlePanMove = (e) => {
        if (this.state.dragging) {
            let posX = e.x;
            let posY = e.y;

            if (e.type === 'touchmove') {
                posX = e.touches[0].clientX;
                posY = e.touches[0].clientY;
            }

            let diffLeft = posX - this.state.pointerLeft;
            let diffTop = posY - this.state.pointerTop;

            let newPanLeft = this.state.panLeft + diffLeft;
            let newPanTop = this.state.panTop + diffTop;

            let isOutsideLeft = newPanLeft > 0;
            let isOutsideTop = newPanTop > 0;

            
            let isOutsideRight = newPanLeft + this.props.width < this.props.containerWidth;
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

    handlePanStop = (e) => {
        let posX = e.x;
        let posY = e.y;

        if (e.type === 'touchend') {
            if (!e.touches.length) {
                return;
            }
            posX = e.touches[0].clientX;
            posY = e.touches[0].clientY;
        }

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
                containerWidth: this.props.containerWidth,
                containerHeight: this.props.containerHeight
            });
        })
        return <div className="pan" ref={node => this.node = node} style={style}>
            {children}
        </div>;
    }
}