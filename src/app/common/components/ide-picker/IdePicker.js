import React, { Component } from 'react'
import { connect } from 'react-redux';
import './IdePicker.css';

import mvnImg from 'app/assets/mvn.png';

import npmImg from 'app/assets/npm.png';

import { setMavenIde, setNpmIde } from 'app/common/reducers/settings-reducer/actions';

import INTELLIJ_IMAGE from 'app/assets/ide-icons/intellij.png';
import WEBSTORM_IMAGE from 'app/assets/ide-icons/webstorm.png';
import VSCODE_IMAGE from 'app/assets/ide-icons/vscode.png';

const findIdes = window.require('electron').remote.require('./utils/ide/ide-scanner-caller').findIdes;

class IdePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            availableMvnIdes: [],
            availableNpmIdes: []
        }
    }

    render() {
        const { availableMvnIdes, availableNpmIdes } = this.state;
        return (
            <div className="ide-picker">
                {!!this.state.loading && <div className="loading">Loading...</div>}
                {!this.state.loading &&
                    <div>
                        <section>
                            <div className="section-header">
                                <img src={mvnImg} alt="Maven"></img>
                                <h2>Maven</h2>
                                <div className="line"></div>
                            </div>
                            <ul>
                                {availableMvnIdes.map(ide => (
                                    <li key={ide.path} className={`${this.props.mavenIde.path === ide.path ? 'selected' : ''}`} onClick={() => this.props.setMavenIde(ide)}>
                                        <div className="primary-details">
                                            <img alt={ide.name} src={this.getImage(ide)}></img>
                                            <span>{ide.name}</span>
                                        </div>
                                    </li>
                                ))}
                                <li key="other" className={`${this.props.mavenIde.type === 'OTHER' ? 'selected' : ''}`} onClick={this.setToManualMavenIde}>
                                    <span>Other</span>
                                    {this.props.mavenIde.type === 'OTHER' &&
                                        <div className="other-inputs">
                                            <div className="path">
                                                <label htmlFor="path">Path to executable:</label>
                                                <input autoFocus name="path" type="text" placeholder="C:\Windows\explorer.exe" value={this.props.mavenIde.path} onChange={this.handleMvnIdePathChange}></input>
                                            </div>
                                            <div className="args">
                                                <label htmlFor="args">Arguments:</label>
                                                <input name="args" type="text" placeholder="ex. '-f {{file}}' OR '-d {{directory}}'" value={this.props.mavenIde.args.join(' ')} onChange={this.handleMvnIdeArgsChange}></input>
                                            </div>
                                        </div>
                                    }
                                </li>
                            </ul>
                        </section>
                        <section>
                            <div className="section-header">
                                <img src={npmImg} alt="NPM"></img>
                                <h2>NPM</h2>
                                <div className="line"></div>
                            </div>
                            <ul>
                                {availableNpmIdes.map(ide => (
                                    <li key={ide.path} className={`${this.props.npmIde.path === ide.path ? 'selected' : ''}`} onClick={() => this.props.setNpmIde(ide)}>
                                        <div className="primary-details">
                                            <img alt={ide.name} src={this.getImage(ide)}></img>
                                            <span>{ide.name}</span>
                                        </div>
                                    </li>
                                ))}
                                <li key="other" className={`${this.props.npmIde.type === 'OTHER' ? 'selected' : ''}`} onClick={this.setToManualNpmIde}>
                                    <span>Other</span>
                                    {this.props.npmIde.type === 'OTHER' &&
                                        <div className="other-inputs">
                                            <div className="path">
                                                <label htmlFor="path">Path to executable:</label>
                                                <input name="path" type="text" placeholder="C:\Windows\explorer.exe" value={this.props.npmIde.path} onChange={this.handleNpmIdePathChange}></input>
                                            </div>
                                            <div className="args">
                                                <label htmlFor="args">Arguments:</label>
                                                <input name="args" type="text" placeholder="ex. '-f {{file}}' OR '-d {{directory}}'" value={this.props.npmIde.args.join(' ')} onChange={this.handleNpmIdeArgsChange}></input>
                                            </div>
                                        </div>
                                    }
                                </li>
                            </ul>
                        </section>
                    </div>
                }
            </div>
        )
    }

    getImage(ide) {
        switch (ide.type) {
            case 'INTELLIJ': return INTELLIJ_IMAGE;
            case 'WEBSTORM': return WEBSTORM_IMAGE;
            case 'VSCODE': return VSCODE_IMAGE;
            default: return '';
        }
    }

    async componentDidMount() {
        this.setState({
            loading: true
        });
        const ides = await findIdes();
        this.setState({
            loading: false,
            availableMvnIdes: ides.availableMvnIdes,
            availableNpmIdes: ides.availableNpmIdes
        });
    }

    handleMvnIdePathChange = (event) => {
        const { mavenIde } = this.props;
        mavenIde.path = event.target.value.replace(/"/g, "");
        this.props.setMavenIde(mavenIde);
        this.forceUpdate();
        this.props.onChange && this.props.onChange();
    }

    handleNpmIdePathChange = (event) => {
        const { npmIde } = this.props;
        npmIde.path = event.target.value.replace(/"/g, "");
        this.props.setNpmIde(npmIde);
        this.forceUpdate();
        this.props.onChange && this.props.onChange();
    }

    handleMvnIdeArgsChange = (event) => {
        const { mavenIde } = this.props;
        mavenIde.args = event.target.value.split(' ');
        this.props.setMavenIde(mavenIde);
        this.forceUpdate();
        this.props.onChange && this.props.onChange();
    }

    handleNpmIdeArgsChange = (event) => {
        const { npmIde } = this.props;
        npmIde.args = event.target.value.split(' ');
        this.props.setNpmIde(npmIde);
        this.forceUpdate();
        this.props.onChange && this.props.onChange();
    }

    setToManualMavenIde = () => {
        if (this.props.mavenIde.type !== 'OTHER') {
            this.props.setMavenIde({
                type: 'OTHER',
                name: 'Other',
                path: '',
                args: []
            });
        }
    }

    setToManualNpmIde = () => {
        if (this.props.npmIde.type !== 'OTHER') {
            this.props.setNpmIde({
                type: 'OTHER',
                name: 'Other',
                path: '',
                args: []
            });
        }
    }
}

const mapStateToProps = state => ({
    mavenIde: state.settingsReducer.mavenIde,
    npmIde: state.settingsReducer.npmIde
})

export default connect(mapStateToProps, { setMavenIde, setNpmIde })(IdePicker);