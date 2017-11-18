// React
import * as React from 'react';
// Mobx
import { observer, Provider } from 'mobx-react';
// Container
import UIContainer from './UIContainer';

interface PlayerContainerProps extends React.Props<any> {
  playList: object[];
  id: string | number;
  layout: string;
  store: any;
  accuracy?: any;
  lang?: string;
}

@observer
export class PlayerContainer extends React.Component<PlayerContainerProps> {
  store: object = undefined;

  public constructor(props: PlayerContainerProps) {
    super(props);

    this.store = props.store;
    if (typeof window !== 'undefined') {
      (window as any).MUSE._instances[props.id] = this;
    }
  }

  public componentWillMount(): void {
    const { layout, playList, id, store, lang } = this.props;
    // register instance
    store.createPlayerInstance(
      {
        playerLayout: layout,
        playList,
        lang
      },
      id
    );
  }

  public render(): React.ReactElement<any> {
    const { accuracy, store } = this.props;
    return (
      <Provider store={store.getInstance(this.props.id)}>
        <UIContainer
          id={this.props.id}
          accuracy={accuracy ? accuracy : false}
        />
      </Provider>
    );
  }
}

export default PlayerContainer;
