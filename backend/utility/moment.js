const moment = require('moment');
const timeString = '10:05am';
const formattedTime = moment(timeString, 'hh:mma').format('HH:mm:ss'); // "10:05:00"
