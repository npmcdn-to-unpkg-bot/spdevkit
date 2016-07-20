import * as React from 'react';

import styles from './Spdevkitgdrive.module.scss';

export interface ISpdevkitgdriveProps {
  description: string;
}

export default class Spdevkitgdrive extends React.Component<ISpdevkitgdriveProps, {}> {
  public render(): JSX.Element {
    return (
      <div className={styles.spdevkitgdrive}>
        <div>This is the <b>{this.props.description}</b> webpart.</div>
      </div>
    );
  }
}
