class CalendarModule {
    constructor(year, month) {
        let _this = this;
        let prevMonth = document.getElementById("prevMonth");
        let nextMonth = document.getElementById("nextMonth");

        this.data = [];
        this.year;
        this.month;
        if (year) {
            this.selectYear(year);
        } else {
            const nowDate = new Date();
            const nowYear = nowDate.getFullYear();//number      
            this.selectYear(nowYear);
        }
        if (month) {
            this.selectMonth(month);
        } else {
            const nowDate = new Date();
            const nowMonth = nowDate.getMonth(); //number              
            this.selectMonth(nowMonth);
        }
        this.fillDaysMonths();
        this.draw();
        this.changeMonth(this.getSelectedMonth());

        prevMonth.onclick = function () {
            let selectedMonth = _this.getSelectedMonth();
            let newMonth;
            if (selectedMonth === 0) {
                newMonth = 11;
                _this.selectYear(_this.getSelectedYear() - 1);
            } else {
                newMonth = selectedMonth - 1;
            }
            _this.changeMonth(newMonth);
        };
        nextMonth.onclick = function () {
            let selectedMonth = _this.getSelectedMonth();
            let newMonth;
            if (selectedMonth === 11) {
                newMonth = 0;
                _this.selectYear(_this.getSelectedYear() + 1);
            } else {
                newMonth = selectedMonth + 1;
            }
            _this.changeMonth(newMonth);
        };

    }

    selectYear(year) {
        this.year = year - 0;
    }
    getSelectedYear() {
        return this.year;
    }

    selectMonth(month) {
        this.month = month - 0;
    }
    getSelectedMonth() {
        return this.month;
    }

    fillDaysMonths() {//fill calenadar data 
        const calendarYear = this.year;
        for (let i = 0; i < 12; i++) {
            const month = new Date(calendarYear, i);
            let monthObj = {
                monthName: getMonthNameByNumber(i),
                monthNumber: i + 1,//number start from 1
                days: [],
                year: calendarYear
            };
            for (let j = 0; j < month.daysInMonth(); j++) {
                let dayObj = {
                    friends: [],
                    dayNumber: j + 1//number start from 1
                }
                monthObj.days.push(dayObj);
            }
            this.data[i] = monthObj;
        } //#for
    }

    draw() {
        const data = this.data;
        let calendar = document.getElementById('calendar');
        let calendarBody = document.getElementById('calendarBody');

        for (let month of data) {
            let monthDiv = document.createElement('div');
            monthDiv.className = "month";
            monthDiv.name = month.monthName;
            calendarBody.appendChild(monthDiv);

            for (let day of month.days) {
                var dayDiv = document.createElement('div');
                dayDiv.className = "day";
                dayDiv.innerHTML = `<p>${day.dayNumber}</p>`;
                monthDiv.appendChild(dayDiv);
            } //#for days           
        } //#for months        
        calendar.style.display = 'block';
    }//#draw   


    fillVkData(vkData) {
        const calendarData = this.data;
        const calendarYear = this.year;
        const dateRegExp = /^(\d{1,2})\.(\d{1,2})\.*(\d{0,4})/;

        for (let friend of vkData) {
            if (friend.bdate) {
                const bddate = dateRegExp.exec(friend.bdate);
                const bdDay = bddate[1] - 0;
                const bdMonth = bddate[2] - 0;
                const bdYear = bddate[3] - 0;
                const dayObj = calendarData[bdMonth - 1].days[bdDay - 1];//in js month and day strat from 0
                if (bdYear !== 0) {
                    friend.age = calendarYear - bdYear + 1; //age on db date
                }
                if (friend.age > 0 || bdYear === 0)
                    dayObj.friends.push(friend);
            }//#if    
        } //#for data
        this.drawVkBd();
    }

    drawVkBd() {
        let calendarBody = document.getElementById('calendarBody');
        let monthDivs = calendarBody.childNodes;

        for (let month of this.data) {
            let monthDiv = monthDivs[month.monthNumber - 1];
            let dayDivs = monthDiv.childNodes;
            for (let day of month.days) {
                let dayDiv = dayDivs[day.dayNumber - 1];
                let countFriend = day.friends.length;
                for (let friend of day.friends) {
                    let link = document.createElement('a');
                    link.target = '_blank';
                    link.className = 'vkPhoto';
                    link.title = `${friend.first_name} ${friend.last_name}`;
                    link.href = `https://vk.com/${friend.domain}`;

                    let size = 52/countFriend;
                    let img = new Image();
                    img.src = friend.photo_50;
                    img.width = size;
                    img.height = size;
                    link.appendChild(img);

                    dayDiv.appendChild(link); 
                }//#for friend
            }//#for day
        }//#for month
    }//#drawVkBd 

    changeMonth(monthNumber) {      
        //header
        let monthNameDiv = document.getElementById('monthName');
        monthNameDiv.innerHTML = `${getMonthNameByNumber(monthNumber)} ${this.getSelectedYear()}`;
        //body
        let monthDivs = document.getElementsByClassName('month');        
        let prevMonthDiv = monthDivs[this.getSelectedMonth()];
        let nextMonthDiv = monthDivs[monthNumber];
        prevMonthDiv.style.display = "none";
        nextMonthDiv.style.display = "block";
        this.selectMonth(monthNumber);      
    }//#changeMonth
}


function getMonthNameByNumber(monthNumber) {
    const month = new Date(2000, monthNumber);
    const monthLong = month.toLocaleString('ru', {
        month: 'long'
    });
    return monthLong.toLocaleUpperCase();
}

Date.prototype.daysInMonth = function () {
    return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
};