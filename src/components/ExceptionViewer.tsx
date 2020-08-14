import { AppException, AppTheme } from 'src/types';
import {
    Dialog,
    DialogBase,
    DialogFooter,
    DialogType,
    IDialogContentProps,
    IModalProps,
    Icon,
    PrimaryButton,
    mergeStyleSets,
} from '@fluentui/react';

import React from 'react';
import { RootState } from 'src/redux/store/types';
import { appActions } from 'src/redux/features/app';
import { connect } from 'react-redux';
import { dismissException } from 'src/redux/features/app/actions';

interface Props {
    exceptions: AppException[];
    dismissException: typeof dismissException;
    theme: AppTheme;
}
const dialogContentProps: IDialogContentProps = {
    type: DialogType.largeHeader,
};

function ExceptionViewer({ exceptions, dismissException, theme }: Props) {
    const [exception, setException] = React.useState<AppException>(null);
    const [dialogVisible, setDialogVisible] = React.useState(false);
    if (!!exceptions.length && exception !== exceptions[0]) {
        setException(exceptions[0]);
    }
    if (!dialogVisible && !!exception && !!exceptions.length) {
        setDialogVisible(true);
    } else if (!!dialogVisible && !exceptions.length) {
        setDialogVisible(false);
    }
    const isWarning = exception?.type === 'WARNING';
    const classes = buildClasses(theme, isWarning);
    const headerIconName = isWarning ? 'Warning' : 'Error';
    return (
        <Dialog
            className={classes.dialog}
            hidden={!dialogVisible}
            dialogContentProps={{
                ...dialogContentProps,
                title: (
                    <div className={classes.header}>
                        <Icon
                            className={classes.headerIcon}
                            iconName={headerIconName}
                        />
                        <span>{isWarning ? 'Warning' : 'Error'}</span>
                    </div>
                ),
            }}
        >
            <p className={classes.message}>{exception?.message}</p>
            <pre className={classes.stack}>{exception?.stack}</pre>
            <DialogFooter>
                <PrimaryButton
                    text='Dismiss'
                    onClick={() => dismissException(exception)}
                />
            </DialogFooter>
        </Dialog>
    );
}
const mapStateToProps = (state: RootState) => ({
    exceptions: state.app.exceptions,
    theme: state.app.theme,
});
const mapDispatchToProps = {
    dismissException: appActions.dismissException,
};
export default connect(mapStateToProps, mapDispatchToProps)(ExceptionViewer);

const buildClasses = (theme: AppTheme, isWarning: boolean) => {
    return mergeStyleSets({
        dialog: {
            selectors: {
                '.ms-Dialog-main': {
                    maxWidth: '80vw',
                },
            },
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            color: theme.semanticColors.bodyText,
        },
        headerIcon: {
            marginRight: 8,
            color: isWarning ? theme.palette.yellow : theme.palette.red,
        },
        message: {
            padding: 12,
            background: theme.semanticColors.bodyBackgroundChecked,
            borderRadius: 3,
            fontSize: '1.1rem',
            margin: '0 0 1em',
        },
        stack: {
            whiteSpace: 'pre-wrap',
            padding: 12,
            background: theme.semanticColors.bodyBackgroundHovered,
            borderRadius: 3,
            color: theme.semanticColors.bodyTextChecked,
            fontFamily: 'Roboto Mono',
            fontSize: '.7rem',
        },
    });
};
