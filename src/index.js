import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

class EasyTimePicker extends React.Component {
  state = {
    hour: "00",
    minutes: "00",
    seconds: "00",
    showHours: false,
    showMinutes: false,
    showSeconds: false,
    showPeriod: false,
    isInputFocused: false,
    period: "AM"
  };

  static propTypes = {
    withSeconds: PropTypes.bool,
    twelveHourFormat: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onChange: PropTypes.func,
    minuteSteps: PropTypes.number,
    secondSteps: PropTypes.number
  };

  static defaultProps = {
    withSeconds: true,
    twelveHourFormat: true,
    minuteSteps: 1,
    secondSteps: 1,
    value: '00:00:00',
    onChange: () => {}
  };

  validRegexWithSeconds = new RegExp(/^\d{2}:\d{2}:\d{2}(|\s(AM|PM))$/);
  validRegexWithoutSeconds = new RegExp(/^\d{2}:\d{2}(|\s(AM|PM))$/);

  componentDidMount() {
    this.setValueFromProps();
    document.addEventListener("click", this.handleOuterClick, false);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setValueFromProps();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleOuterClick, false);
  }

  setTimeFromStringValue = value => {
    if (this.validRegexWithSeconds.test(value)) {
      const [hour, minutes, seconds, period = "AM"] = value.split(/[\s:]/);
      this.setState({ hour, minutes, seconds, period });
      return;
    }
    if (this.validRegexWithoutSeconds.test(value)) {
      const [hour, minutes, period = "AM"] = value.split(/[\s:]/);
      this.setState({ hour, minutes, seconds: "00", period });
      return;
    }
  };

  setValueFromProps = () => {
    const { value } = this.props;
    if (value) {
      if (value instanceof Date && !isNaN(value.getTime())) {
        let locale = "en-US";
        if (!this.props.twelveHourFormat) {
          locale = "en-GB";
        }
        const valueFromDate = value.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
        this.setTimeFromStringValue(valueFromDate);
        return;
      }
      this.setTimeFromStringValue(value);
    }
  };

  handleOuterClick = e => {
    const { isInputFocused } = this.state;
    if (
      (this.timePicker && this.timePicker.contains(e.target)) ||
      isInputFocused
    ) {
      return;
    }
    this.setState({
      showHours: false,
      showMinutes: false,
      showSeconds: false,
      showPeriod: false
    });
  };

  makeValidRegexForHour = () => {
    const { twelveHourFormat } = this.props;
    return twelveHourFormat
      ? new RegExp(/^([0-1]|0[0-9]|1[0-2])$/)
      : new RegExp(/^([0-2]|0[0-9]|1[0-9]|2[0-4])$/);
  };

  shiftToNextInput = currentInput => {
    switch (currentInput) {
      case "hour":
        this.minutesInput.value = this.minutesInput.value;
        this.minutesInput.focus();
        break;
      case "minutes":
        if (this.props.withSeconds) {
          this.secondsInput.value = this.secondsInput.value;
          this.secondsInput.focus();
        }
        break;
      default:
        return;
    }
  };

  handleInputChange = e => {
    const { value, name } = e.target;
    const validInput =
      name === "hour"
        ? this.makeValidRegexForHour()
        : new RegExp(/^[0-5][0-9]{0,1}$/);
    if (!value || validInput.test(value)) {
      this.setState({ [name]: value }, () => {
        this.makeValueToSpitToParent();
      });
      if (value.length === 2) {
        this.shiftToNextInput(name);
      }
    }
  };

  handleFocus = e => {
    const { name } = e.target;
    switch (name) {
      case "hour":
        this.setState({
          showHours: true,
          showMinutes: false,
          showSeconds: false,
          showPeriod: false
        });
        break;
      case "minutes":
        this.setState({
          showHours: false,
          showMinutes: true,
          showSeconds: false,
          showPeriod: false
        });
        break;
      case "seconds":
        this.setState({
          showHours: false,
          showMinutes: false,
          showSeconds: true,
          showPeriod: false
        });
        break;
    }
    this.setState({ isInputFocused: true });
  };

  handleBlur = e => {
    const { name, value } = e.target;
    if (!/\d{2}/.test(value)) {
      this.setState({ [name]: "00" }, () => {
        this.makeValueToSpitToParent();
      });
    }
    this.setState({ isInputFocused: false });
  };

  handleKeyDown = e => {
    const { name, selectionStart } = e.target;
    switch (name) {
      case "hour":
        if (e.keyCode === 39 && selectionStart === 2) {
          this.minutesInput.focus();
        }
        break;
      case "minutes":
        if (e.keyCode === 39 && selectionStart === 2) {
          this.secondsInput.focus();
        }
        if (e.keyCode === 37 && selectionStart === 0) {
          this.hourInput.focus();
        }
        break;
      case "seconds":
        if (e.keyCode === 37 && selectionStart === 0) {
          this.minutesInput.focus();
        }
        break;
    }
  };

  handlePeriodChange = value => {
    this.setState({ period: value, showPeriod: false }, () => {
      this.makeValueToSpitToParent();
    });
  };

  handlePeriodBlur = () => {
    this.setState({ isInputFocused: false });
  };

  handlePeriodClick = () => {
    this.setState({
      showHours: false,
      showMinutes: false,
      showSeconds: false,
      showPeriod: true,
      isInputFocused: true
    });
  };

  selectTime = (name, value, key) => {
    this.setState({ [name]: value, [key]: false }, () => {
      this.makeValueToSpitToParent();
    });
    this.shiftToNextInput(name);
  };

  makeValueToSpitToParent = () => {
    const { hour, minutes, seconds, period } = this.state;
    const { withSeconds, twelveHourFormat } = this.props;
    let formattedTime = `${hour}:${minutes}`;
    if (withSeconds) formattedTime += `:${seconds}`;
    if (twelveHourFormat) formattedTime += ` ${period}`;
    if (withSeconds && this.validRegexWithSeconds.test(formattedTime)) {
      this.props.onChange(formattedTime);
      return;
    }
    if (this.validRegexWithoutSeconds.test(formattedTime)) {
      this.props.onChange(formattedTime);
    }
  };

  makeHours = () => {
    const { twelveHourFormat } = this.props;
    const numberOfHours = twelveHourFormat ? 13 : 24;
    return Array(numberOfHours)
      .fill("")
      .map((_, i) => {
        if (i < 10) {
          return (
            <li
              key={i}
              onClick={() => this.selectTime("hour", `0${i}`, "showHours")}>
              {`0${i}`}
            </li>
          );
        }
        return (
          <li key={i}
            onClick={() => this.selectTime("hour", String(i), "showHours")}>
            {i}
          </li>
        );
      });
  };

  makeMinutesAndSeconds = (name, flag) => {
    const stepsKey = name === "minutes" ? "minuteSteps" : "secondSteps";
    return Array(60)
      .fill("")
      .reduce((units, _, i) => {
        if (i % this.props[stepsKey] === 0) {
          if (i < 10) {
            units = units.concat(
              <li key={i} onClick={() => this.selectTime(name, `0${i}`, flag)}>
                {`0${i}`}
              </li>
            );
          } else {
            units = units.concat(
              <li key={i}
                onClick={() => this.selectTime(name, String(i), flag)}>
                {i}
              </li>
            );
          }
        }

        return units;
      }, []);
  };

  makePickerDropDown = (makeOptions, optionKey, flag) => (
    <ul
      ref={el => (this.timePicker = el)}
      className={`time-picker-input--time-options ${
        this.state[flag] ? "show-time-options" : "hide-time-options"
      }`}>
      {makeOptions(optionKey, flag)}
    </ul>
  );

  render() {
    return (
      <div className="time-picker-input-container">
        <div className="time-picker-input__input hour">
          <input
            type="text"
            name="hour"
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeyDown}
            ref={el => (this.hourInput = el)}
            value={this.state.hour}
            onChange={this.handleInputChange}
          />
          {this.makePickerDropDown(this.makeHours, null, "showHours")}
        </div>
        :
        <div className="time-picker-input__input minutes">
          <input
            type="text"
            name="minutes"
            onFocus={this.handleFocus}
            onKeyDown={this.handleKeyDown}
            onBlur={this.handleBlur}
            ref={el => (this.minutesInput = el)}
            value={this.state.minutes}
            onChange={this.handleInputChange}
          />
          {this.makePickerDropDown(
            this.makeMinutesAndSeconds,
            "minutes",
            "showMinutes"
          )}
        </div>
        {this.props.withSeconds && (
          <React.Fragment>
            :
            <div className="time-picker-input__input seconds">
              <input
                type="text"
                name="seconds"
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onKeyDown={this.handleKeyDown}
                ref={el => (this.secondsInput = el)}
                value={this.state.seconds}
                onChange={this.handleInputChange}
              />
              {this.makePickerDropDown(
                this.makeMinutesAndSeconds,
                "seconds",
                "showSeconds"
              )}
            </div>
          </React.Fragment>
        )}
        {this.props.twelveHourFormat && (
          <div className="time-picker-input__input period">
            <p
              className="time-picker-input__input--value"
              onClick={this.handlePeriodClick}
              tabIndex="1"
              onBlur={this.handlePeriodBlur}
            >
              {this.state.period}
            </p>
            <ul
              ref={el => (this.timePicker = el)}
              className={`time-picker-input--time-options period ${
                this.state.showPeriod
                  ? "show-time-options"
                  : "hide-time-options"
              }`}
            >
              <li onClick={() => this.handlePeriodChange("AM")}>AM</li>
              <li onClick={() => this.handlePeriodChange("PM")}>PM</li>
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default EasyTimePicker;
