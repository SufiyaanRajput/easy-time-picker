## Easy time picker for your react projects.

BASIC USAGE:

``` <EasyTimePicker onChange={changeHandler} value="03:00 PM"/> ```

Props:

    <!-- show time with seconds -->
    withSeconds: PropTypes.bool,
    
    <!-- show time in 12 hour format -->
    twelveHourFormat: PropTypes.bool,

    <!-- default value -->
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

    <!-- on change handler -->
    onChange: PropTypes.func,

    <!-- skip minutes in dropdown options -->
    minuteSteps: PropTypes.number,

    <!-- skip seconds in dropdown options -->
    secondSteps: PropTypes.number


DEFAULT VALUES:

    The default value in ISO can be passed as: ``` new Date("2020-01-20T10:35:57.341Z") ```

    Formatted values are also accepted for example:
    '02:00 PM' or '34:00:98' if twelveHourFormat is false.

    The time picker defaults to '00:00' when the value passed is invalid.

DEFAULT PROPS:

    withSeconds: true,

    twelveHourFormat: true,

    minuteSteps: 1,

    secondSteps: 1,

    value: '00:00 AM'