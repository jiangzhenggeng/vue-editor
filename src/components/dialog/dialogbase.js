
import './_dialogbase.less';

import React from 'react';

class Dialogbase extends React.Component{

  constructor(props){
    super(props);
    this.close = this.close.bind(this);
  }

  render(){
    if( !this.props.show ) return <div />;

    return (
        <div className="model__wrap">
          <div className="model__table">
            <div className="model__td">
              <div  className="model__inner">
                <div className="model__content">
                  {this.props.title!==false?<div className="model__header">
                    <div className="model__title">我是标题</div>
                    <div className="model__close" onClick={this.close}>×</div>
                  </div>:''}
                  <div className="model__body">
                    {this.props.children}
                  </div>
                  <div className="model__footer"></div>
                </div>
              </div>
              <div className="model__mask" onClick={this.close}></div>
          </div>
      </div>
    </div>
    );
  }

  close(){
    this.props.parent.close();
  }

}

export default Dialogbase;