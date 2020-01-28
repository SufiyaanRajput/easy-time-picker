import React from 'react';
import {shallow, mount} from 'enzyme';
import EasyTimePicker from '../src/index';

test('should render time picker component with default props and time', () => {
  const wrapper = shallow(<EasyTimePicker />);
  expect(wrapper).toMatchSnapshot();
});

test('should render in 24 hour format', () => {
  const wrapper = shallow(<EasyTimePicker twelveHourFormat={false}/>);
  expect(wrapper).toMatchSnapshot();
});

test('should render in without seconds', () => {
  const wrapper = shallow(<EasyTimePicker withSeconds={false}/>);
  expect(wrapper).toMatchSnapshot();
});

test('should render with provided value', () => {
  const wrapper = shallow(<EasyTimePicker value="09:23:59 PM"/>);
  expect(wrapper).toMatchSnapshot();
});

test('should add default seconds "00" when missing in value prop', () => {
  const wrapper = shallow(<EasyTimePicker value="09:23 PM"/>);
  expect(wrapper).toMatchSnapshot();
});

test('should render with provided value with no seconds field', () => {
  const wrapper = shallow(<EasyTimePicker value="11:23 PM" withSeconds={false}/>);
  expect(wrapper).toMatchSnapshot();
});

test('should skip seconds value provided in value prop if withSeconds prop is false', () => {
  const wrapper = shallow(<EasyTimePicker value="11:23:32 PM" withSeconds={false}/>);
  expect(wrapper).toMatchSnapshot();
});

test('should render with default period "AM" when no period in value prop', () => {
  const wrapper = shallow(<EasyTimePicker value="11:23"/>);
  expect(wrapper).toMatchSnapshot();
});

test('should trigger on change for hours and focus on minutes', () => {
  const wrapper = mount(<EasyTimePicker twelveHourFormat={false}/>);
  expect(wrapper).toMatchSnapshot();
  wrapper.find('input[name="hour"]').simulate('change', {target: {value: '11', name: 'hour'}});
  expect(wrapper.state('hour')).toEqual('11');;
  expect(wrapper.find('input[name="minutes"]').is(':focus')).toEqual(true);
  expect(wrapper).toMatchSnapshot();
});

test('should trigger on change for minutes and focus on seconds', () => {
  const wrapper = mount(<EasyTimePicker />);
  expect(wrapper).toMatchSnapshot();
  wrapper.find('input[name="minutes"]').simulate('change', {target: {value: '37', name: 'minutes'}});
  expect(wrapper.state('minutes')).toEqual('37');
  expect(wrapper.find('input[name="seconds"]').is(':focus')).toEqual(true);
  expect(wrapper).toMatchSnapshot();
});

test('should spit value to parent without seconds', () => {
  const onChange = jest.fn();
  const wrapper = mount(<EasyTimePicker withSeconds={false} onChange={onChange}/>);
  wrapper.find('input[name="hour"]').simulate('change', {target: {value: '07', name: 'hour'}});
  expect(onChange).toHaveBeenCalled();
  expect(onChange).toHaveBeenCalledWith('07:00 AM')
});

describe('handle focus for inputs', () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = shallow(<EasyTimePicker />);
    expect(wrapper).toMatchSnapshot();
  });

  afterEach(() => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should focus hours and close other dropdowns', () => {
    wrapper.find('input[name="hour"]').simulate('focus', {target: {name: 'hour'}});
    expect(wrapper.state('showHours')).toBeTruthy();
    expect(wrapper.state('showMinutes')).toBeFalsy();
    expect(wrapper.state('showSeconds')).toBeFalsy();
    expect(wrapper.state('isInputFocused')).toBeTruthy();
  });

  it('should focus minutes and close other dropdowns', () => {
    wrapper.find('input[name="minutes"]').simulate('focus', {target: {name: 'minutes'}});
    expect(wrapper.state('showHours')).toBeFalsy();
    expect(wrapper.state('showMinutes')).toBeTruthy();
    expect(wrapper.state('showSeconds')).toBeFalsy();
    expect(wrapper.state('isInputFocused')).toBeTruthy();
  });

  it('should focus seconds and close other dropdowns', () => {
    wrapper.find('input[name="seconds"]').simulate('focus', {target: {name: 'seconds'}});
    expect(wrapper.state('showHours')).toBeFalsy();
    expect(wrapper.state('showMinutes')).toBeFalsy();
    expect(wrapper.state('showSeconds')).toBeTruthy();
    expect(wrapper.state('isInputFocused')).toBeTruthy();
  });
});

describe('handle focus for inputs', () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = shallow(<EasyTimePicker />);
    expect(wrapper).toMatchSnapshot();
  });

  afterEach(() => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should set input focused to false on blur', () => {
    wrapper.find('input[name="seconds"]').simulate('blur', {target: {name: 'seconds', value: '04'}});
    expect(wrapper.state('isInputFocused')).toBeFalsy();
  });

  it('should set input focused to false on blur and set value to 00 on invalid passed value', () => {
    wrapper.find('input[name="seconds"]').simulate('blur', {target: {name: 'minutes', value: '9'}});
    expect(wrapper.state('minutes')).toEqual('00');
    expect(wrapper.state('isInputFocused')).toBeFalsy();
  });
});

describe('select time from dropdown', () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = mount(<EasyTimePicker />);
    expect(wrapper).toMatchSnapshot();
  });

  afterEach(() => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should set hours when selected from dropdown and focus minutes and close hours dropdown', () => {
    wrapper.find('.time-picker-input__input.hour .time-picker-input--time-options li').at(4).simulate('click');
    expect(wrapper.state('hour')).toEqual('04');
    expect(wrapper.state('showHours')).toBeFalsy();
    expect(wrapper.find('input[name="minutes"]').is(':focus')).toEqual(true);
  });

  it('should set 11 in hours', () => {
    wrapper.find('.time-picker-input__input.hour .time-picker-input--time-options li').at(11).simulate('click');
    expect(wrapper.state('hour')).toEqual('11');
  });

  it('should set minutes when selected from dropdown and focus seconds and close minutes dropdown', () => {
    expect(wrapper).toMatchSnapshot();
    wrapper.find('.time-picker-input__input.minutes .time-picker-input--time-options li').at(59).simulate('click');
    expect(wrapper.state('minutes')).toEqual('59');
    expect(wrapper.state('showMinutes')).toBeFalsy();
    expect(wrapper.find('input[name="seconds"]').is(':focus')).toEqual(true);
  });

  it('should set seconds when selected from dropdown and focus none and close seconds dropdown', () => {
    expect(wrapper).toMatchSnapshot();
    wrapper.find('.time-picker-input__input.seconds .time-picker-input--time-options li').at(1).simulate('click');
    expect(wrapper.state('seconds')).toEqual('01');
    expect(wrapper.state('showSeconds')).toBeFalsy();
  });
});

describe('handle period change', () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = mount(<EasyTimePicker />);
    expect(wrapper).toMatchSnapshot();
  });

  afterEach(() => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should set PM on click', () => {
    wrapper.find('.time-picker-input--time-options.period li').at(1).simulate('click', 'PM');
    expect(wrapper.state('period')).toEqual('PM');
    expect(wrapper.state('showPeriod')).toBeFalsy();
  });

  it('should set AM on click', () => {
    wrapper.find('.time-picker-input--time-options.period li').at(0).simulate('click', 'AM');
    expect(wrapper.state('period')).toEqual('AM');
    expect(wrapper.state('showPeriod')).toBeFalsy();
  });

  it('should show Period dropdowns and hide others and set isInputFocused to true', () => {
    wrapper.find('.time-picker-input__input--value').simulate('click');
    expect(wrapper.state('showPeriod')).toBeTruthy();
    expect(wrapper.state('isInputFocused')).toBeTruthy();
    expect(wrapper.state('showHours')).toBeFalsy();
    expect(wrapper.state('showMinutes')).toBeFalsy();
    expect(wrapper.state('showSeconds')).toBeFalsy();
  });

  it('should set input focused to false on blur', () => {
    wrapper.find('.time-picker-input__input--value').simulate('blur');
    expect(wrapper.state('isInputFocused')).toBeFalsy();
  });
});

describe('handle key down events on input', () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = mount(<EasyTimePicker />);
    expect(wrapper).toMatchSnapshot();
  });

  afterEach(() => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should switch to minutes from hours on right arrow key when cursor is at the end', () => {
    wrapper.find('input[name="hour"]').props().onKeyDown({keyCode: 39, target:{name: 'hour', selectionStart: 2}});
    expect(wrapper.find('input[name="minutes"]').is(':focus')).toBeTruthy();
  });

  it('should switch to seconds from minutes on right arrow key when cursor is at the end', () => {
    wrapper.find('input[name="minutes"]').props().onKeyDown({keyCode: 39, target:{name: 'minutes', selectionStart: 2}});
    expect(wrapper.find('input[name="seconds"]').is(':focus')).toBeTruthy();
  });

  it('should switch to hours from minutes on left arrow key when cursor is at the beginning', () => {
    wrapper.find('input[name="minutes"]').props().onKeyDown({keyCode: 37, target:{name: 'minutes', selectionStart: 0}});
    expect(wrapper.find('input[name="hour"]').is(':focus')).toBeTruthy();
  });

  it('should switch to minutes from seconds on left arrow key when cursor is at the beginning', () => {
    wrapper.find('input[name="seconds"]').props().onKeyDown({keyCode: 37, target:{name: 'seconds', selectionStart: 0}});
    expect(wrapper.find('input[name="minutes"]').is(':focus')).toBeTruthy();
  });
});

test('should set value from props when value is updated', () => {
  const wrapper = shallow(<EasyTimePicker />);
  spyOn(wrapper.instance(), 'setValueFromProps');
  wrapper.setProps({value: '07:11 PM'});
  expect(wrapper.instance().setValueFromProps).toHaveBeenCalled();
});

test('should close all dropdowns on outer click', () => {
  const wrapper = shallow(<EasyTimePicker />);
  wrapper.instance().handleOuterClick();
  expect(wrapper.state('showHours')).toBeFalsy();
  expect(wrapper.state('showMinutes')).toBeFalsy();
  expect(wrapper.state('showSeconds')).toBeFalsy();
  expect(wrapper.state('showPeriod')).toBeFalsy();
});

test('should not close dropdown when input is focused', () => {
  const wrapper = shallow(<EasyTimePicker />);
  wrapper.find('input[name="minutes"]').props().onFocus({target: {name: 'minutes'}});
  expect(wrapper.state('showMinutes')).toBeTruthy();
  wrapper.instance().handleOuterClick();
  expect(wrapper.state('showMinutes')).toBeTruthy();
});

test('should not close dropdown when item in dropdown is clicked', () => {
  const wrapper = mount(<EasyTimePicker />);
  wrapper.find('input[name="minutes"]').props().onFocus({target: {name: 'minutes'}});
  expect(wrapper.state('showMinutes')).toBeTruthy();
  wrapper.instance().handleOuterClick({});
  wrapper.instance().timePicker.conatains = () => true;
  expect(wrapper.instance().timePicker.conatains()).toEqual(true);
  expect(wrapper.state('showMinutes')).toBeTruthy();
});

test('should remove listener for click on componentWillUnmount', () => {
  const removeEventListener = jest.spyOn(document, 'removeEventListener')
  const wrapper = shallow(<EasyTimePicker />);
  wrapper.unmount();
  expect(removeEventListener).toHaveBeenCalled();
});

test('should skip minutes by 3', () => {
  const wrapper = shallow(<EasyTimePicker minuteSteps={3}/>);
  expect(wrapper).toMatchSnapshot();
});

test('should skip seconds by 3', () => {
  const wrapper = shallow(<EasyTimePicker secondSteps={3}/>);
  expect(wrapper).toMatchSnapshot();
});