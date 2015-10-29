'use strict';

var React = require('react');

var cx = require('classnames');

var InstanceCountdown = React.createClass({
    render: function() {
        var timeLeft = this.props.timeLeft;

        var classesDays = cx('ct-part', {
            'tamed': (Math.floor(timeLeft.asDays()) === 0)
        });
        var classesHours = cx('ct-part', {
            'tamed': (Math.floor(timeLeft.asHours()) === 0)
        });
        var classesMinutes = cx('ct-part', {
            'tamed': (Math.floor(timeLeft.asMinutes()) === 0)
        });
        var classesSeconds = cx('ct-part', {
            'tamed': (Math.floor(timeLeft.asSeconds()) === 0)
        });

        return (
            <ul className="countdown">
                <li className={classesDays}>
                    <div className="ct-val">{Math.floor(timeLeft.asDays())}</div>
                    <div className="ct-label">Days</div>
                </li>
                <li className={classesHours}>
                    <div className="ct-val">{timeLeft.hours()}</div>
                    <div className="ct-label">Hours</div>
                </li>
                <li className={classesMinutes}>
                    <div className="ct-val">{timeLeft.minutes()}</div>
                    <div className="ct-label">Minutes</div>
                </li>
                <li className={classesSeconds}>
                    <div className="ct-val">{timeLeft.seconds()}</div>
                    <div className="ct-label">Seconds</div>
                </li>
            </ul>
        );
    }
});

module.exports = InstanceCountdown;