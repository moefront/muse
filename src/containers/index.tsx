// React
import * as React from 'react';
// Mobx
import { observer } from 'mobx-react';
// Container
import UIContainer from './UIContainer';

interface PlayerContainerProps extends React.Props<any> {
  playList: object[];
  id: string | number;
  layout: string;
  store: any;
  accuracy?: any;
}

@observer
export class PlayerContainer extends React.Component<PlayerContainerProps> {
  store: object = undefined;

  constructor(props: PlayerContainerProps) {
    super(props);

    this.store = props.store;
    if (typeof window !== 'undefined') {
      (window as any).MUSE._instances[props.id] = this;
    }
  }

  componentWillMount() {
    const { layout, playList, id, store } = this.props;
    // register instance
    store.createPlayerInstance({
      playerLayout: layout,
      playList
    }, id);
  }

  render() {
    const { accuracy, store } = this.props;
    return (
      <UIContainer
        store={ store.getInstance(this.props.id) }
        id={ this.props.id }
        accuracy={ accuracy ? accuracy : false }
      />
    );
  }
}

export default PlayerContainer;