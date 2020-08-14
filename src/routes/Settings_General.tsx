import {
    ActionButton,
    Dialog,
    DialogFooter,
    DirectionalHint,
    Dropdown,
    IDropdownOption,
    PrimaryButton,
    Separator,
    Text,
    Toggle,
    TooltipHost,
} from 'office-ui-fabric-react';
import { FontSizes, ITheme, mergeStyleSets } from '@uifabric/styling';
import {
    MotionAnimations,
    MotionDurations,
    MotionTimings,
} from '@uifabric/fluent-theme';
import React, { Component, FormEvent } from 'react';
import { decodeHotKey, encodeHotKey } from 'src/utils/hotkey-tools';

import { AppTheme } from 'src/types';
import { RootState } from 'src/redux/store/types';
import { connect } from 'react-redux';
import hotkeys from 'hotkeys-js';
import { settingsActions } from 'src/redux/features/settings';
import themes from 'src/themes';

const globalShortcut = window.require('electron').remote.globalShortcut;

interface Props {
    className?: string;
    theme: AppTheme;
    reScanOvernight: boolean;
    hotkey: string;
    setThemeName: typeof settingsActions.setThemeName;
    setReScanOvernight: typeof settingsActions.setReScanOvernight;
    setHotkey: typeof settingsActions.setHotkey;
}

interface State {
    hotkeyCaptureVisible: boolean;
    hotkeyCaptured: string[];
    hotkeyValid: boolean;
}

class General extends Component<Props, State> {
    public readonly state: State = {
        hotkeyCaptureVisible: false,
        hotkeyCaptured: [],
        hotkeyValid: false,
    };

    public render() {
        const { theme, className } = this.props;
        const classes = buildClasses(theme);
        const { hotkeyCaptureVisible } = this.state;
        const options = themes.map((t) => ({
            key: t.name,
            text: t.name,
        }));
        return (
            <div
                className={`${classes.general} ${!!className ? className : ''}`}
            >
                <section className={classes.section}>
                    <div className={classes.sectionMeta}>
                        <Text className={classes.sectionTitle}>Theme</Text>
                        <Text className={classes.sectionDescription}>
                            Choose a color scheme for the application
                        </Text>
                    </div>
                    <Dropdown
                        selectedKey={theme.name}
                        styles={{ root: { width: 200 } }}
                        options={options}
                        onChange={this._onThemeChanged}
                    />
                </section>
                <Separator />
                <section className={classes.section}>
                    <div className={classes.sectionMeta}>
                        <Text className={classes.sectionTitle}>
                            Re-scan Overnight
                        </Text>
                        <Text className={classes.sectionDescription}>
                            Automatically re-scan directories overnight
                        </Text>
                    </div>
                    <Toggle
                        checked={this.props.reScanOvernight}
                        onChange={this._onRescanOvernightChanged}
                        onText='On'
                        offText='Off'
                    />
                </section>
                <Separator />
                <section className={classes.section}>
                    <div className={classes.sectionMeta}>
                        <Text className={classes.sectionTitle}>Hotkey</Text>
                        <Text className={classes.sectionDescription}>
                            Specify the key combination that will activate the
                            application when hidden
                        </Text>
                    </div>
                    <Dialog
                        hidden={!hotkeyCaptureVisible}
                        onDismiss={this._cancelHotkeyCapture}
                        dialogContentProps={{ title: 'Set Hotkey' }}
                    >
                        <Text className={classes.hotkeyCaptureLiveView}>
                            {this.state.hotkeyCaptured.join(' + ')}
                        </Text>
                        <DialogFooter>
                            <PrimaryButton
                                disabled={!this.state.hotkeyValid}
                                onClick={this._saveHotkeyCapture}
                                text='Save'
                            />
                        </DialogFooter>
                    </Dialog>
                    <TooltipHost
                        content='Edit Hotkey'
                        directionalHint={DirectionalHint.leftCenter}
                    >
                        <ActionButton
                            iconProps={{ iconName: 'Edit' }}
                            onClick={this._showHotkeyCapture}
                        >
                            {decodeHotKey(this.props.hotkey).join(' + ')}
                        </ActionButton>
                    </TooltipHost>
                </section>
            </div>
        );
    }
    private _onThemeChanged = (
        event: FormEvent<HTMLDivElement>,
        option?: IDropdownOption | undefined,
        index?: number | undefined
    ) => {
        if (!option) {
            return;
        }
        this.props.setThemeName(option.key.toString());
    };
    private _onRescanOvernightChanged = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        checked?: boolean | undefined
    ) => {
        if (checked === undefined) {
            return;
        }
        this.props.setReScanOvernight(checked);
    };

    private _showHotkeyCapture = () => {
        console.log('Capturing Hotkey...');
        globalShortcut.unregisterAll();
        hotkeys('*', this._onHotkeyJsCapture);
        hotkeys('enter', () => {
            if (this.state.hotkeyValid) {
                this._saveHotkeyCapture();
            }
        });
        const decodedHotKey = decodeHotKey(this.props.hotkey);
        this.setState({
            hotkeyCaptureVisible: true,
            hotkeyCaptured: decodedHotKey,
            hotkeyValid: this.isHotkeyValid(decodedHotKey),
        });
    };

    private _cancelHotkeyCapture = () => {
        this._hideHotkeyCapture();
        this.props.setHotkey(this.props.hotkey);
    };

    private _saveHotkeyCapture = () => {
        this._hideHotkeyCapture();
        this.props.setHotkey(encodeHotKey(this.state.hotkeyCaptured));
    };

    private _hideHotkeyCapture = () => {
        console.log('Disabling Capture...');
        hotkeys.unbind('*');
        hotkeys.unbind('enter');
        this.setState({ hotkeyCaptureVisible: false });
    };

    private _onHotkeyJsCapture = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            return;
        }
        const keys: string[] = [];
        if (e.ctrlKey) {
            keys.push('ctrl');
        }
        if (e.altKey) {
            keys.push('alt');
        }
        if (e.shiftKey) {
            keys.push('shift');
        }
        if (
            !!e.key &&
            e.key !== 'Control' &&
            e.key !== 'Shift' &&
            e.key !== 'Alt'
        ) {
            keys.push(e.key.toLowerCase());
        }
        this.setState({
            hotkeyCaptured: keys,
            hotkeyValid: this.isHotkeyValid(keys),
        });
    };

    private isHotkeyValid(decodedHotKey: string[]) {
        return !['ctrl', 'alt', 'shift'].find(
            (invalid) => decodedHotKey[decodedHotKey.length - 1] === invalid
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    theme: state.app.theme,
    reScanOvernight: state.settings.reScanOvernight,
    hotkey: state.settings.hotkey,
});
const mapDispatchToProps = {
    setThemeName: settingsActions.setThemeName,
    setReScanOvernight: settingsActions.setReScanOvernight,
    setHotkey: settingsActions.setHotkey,
};
export default connect(mapStateToProps, mapDispatchToProps)(General);

const buildClasses = (theme: ITheme | null) => {
    if (!theme) {
        return null;
    }
    return mergeStyleSets({
        general: {
            flex: 1,
            overflowY: 'auto',
            padding: '0 16px 16px 16px',
            animation: MotionAnimations.slideDownIn,
            animationDuration: MotionDurations.duration3,
            animationTimingFunction: MotionTimings.decelerate,
        },
        section: {
            display: 'flex',
            padding: '12px 0',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        sectionMeta: {
            display: 'flex',
            flexDirection: 'column',
        },
        sectionTitle: {
            display: 'block',
            fontSize: FontSizes.large,
            color: theme.semanticColors.bodyText,
        },
        sectionDescription: {
            display: 'block',
            color: theme.semanticColors.bodySubtext,
        },
        hotkeyCaptureLiveView: {
            textAlign: 'center',
            display: 'block',
            fontSize: FontSizes.large,
            background: theme.semanticColors.bodyBackgroundHovered,
            padding: '8px 0',
            borderRadius: 4,
        },
    });
};
