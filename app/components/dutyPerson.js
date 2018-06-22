import React from 'react';
import '../less/dutyPerson.less';

class DutyPerson extends React.Component {

    render() {
        return (
            <div className="dutyPerson-box">
                <p className="phoneBubble">
                    <a href=""></a>
                </p>
                <p className="dutyPerson"></p>
            </div>
        )
    }
}

export default DutyPerson;
