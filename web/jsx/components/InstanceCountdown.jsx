'use strict';

var React = require('react');

var InstanceCountdown = React.createClass({
    formatTimeLeft: function() {
        return {
            days:  (this.props.timeLeft / 8.64e7 | 0),
            hours: ((this.props.timeLeft % 8.64e7)/ 3.6e6 | 0),
            minutes: (Math.floor((this.props.timeLeft % 3.6e6) / 6e4)),
            seconds: (Math.floor((this.props.timeLeft % 6e4) / 1000))
        };
    },
    render: function() {
        var formattedTimeLeft = this.formatTimeLeft();
        var cx = React.addons.classSet;
        var classesDays = cx({
            'ct-part': true,
            'tamed': (formattedTimeLeft.days === 0)
        });
        var classesHours = cx({
            'ct-part': true,
            'tamed': (formattedTimeLeft.days === 0 && formattedTimeLeft.hours === 0)
        });
        var classesMinutes = cx({
            'ct-part': true,
            'tamed': (formattedTimeLeft.days === 0 && formattedTimeLeft.hours === 0
            && formattedTimeLeft.minutes === 0 )
        });
        var classesSeconds = cx({
            'ct-part': true,
            'tamed': (formattedTimeLeft.days === 0 && formattedTimeLeft.hours === 0
            && formattedTimeLeft.minutes === 0 && formattedTimeLeft.seconds === 0)
        });

        return (
            <ul className="countdown">
                <li className={classesDays}>
                    <div className="ct-val">{formattedTimeLeft.days}</div>
                    <div className="ct-label">Days</div>
                </li>
                <li className={classesHours}>
                    <div className="ct-val">{formattedTimeLeft.hours}</div>
                    <div className="ct-label">Hours</div>
                </li>
                <li className={classesMinutes}>
                    <div className="ct-val">{formattedTimeLeft.minutes}</div>
                    <div className="ct-label">Minutes</div>
                </li>
                <li className={classesSeconds}>
                    <div className="ct-val">{formattedTimeLeft.seconds}</div>
                    <div className="ct-label">Seconds</div>
                </li>
            </ul>
        );
    }
});

module.exports = InstanceCountdown;