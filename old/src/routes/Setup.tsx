import {
    Redirect,
    Route,
    RouteComponentProps,
    Switch,
    withRouter,
} from 'react-router-dom';

import React from 'react';
import { RootState } from 'src/redux/store/types';
import Setup_Directories from 'src/routes/Setup_Directories';
import Setup_Done from 'src/routes/Setup_Done';
import Setup_FilteredPatterns from 'src/routes/Setup_FilteredPatterns';
import Setup_IDEs from 'src/routes/Setup_IDEs';
import Setup_Start from 'src/routes/Setup_Start';
import { connect } from 'react-redux';

type Props = { setupComplete: boolean } & RouteComponentProps<any>;

function Setup({ match, setupComplete }: Props) {
    if (!!setupComplete) {
        return <Redirect to='/' />;
    }
    const { url } = match;
    return (
        <Switch>
            <Route path={`${url}/start`} component={Setup_Start} />
            <Route
                path={`${url}/filtered-patterns`}
                component={Setup_FilteredPatterns}
            />
            <Route path={`${url}/directories`} component={Setup_Directories} />
            <Route path={`${url}/ides`} component={Setup_IDEs} />
            <Route path={`${url}/done`} component={Setup_Done} />
        </Switch>
    );
}

const mapStateToProps = (state: RootState) => ({
    setupComplete: state.settings.setupComplete,
});
const mapDispatchToProps = {};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Setup));
