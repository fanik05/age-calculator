const wrapper = document.getElementById('root')
wrapper.style.textAlign = 'center'

const displayGreetings = () => {
    const userName = prompt('Enter your name:')

    if (userName) {
        const heading = document.createElement('h1')
        heading.innerText = 'Hello, ' + userName + '!'
        heading.style.marginTop = '20vh'
        wrapper.appendChild(heading)
    } else {
        displayGreetings()
    }
}

displayGreetings()

const displayAge = () => {
    const age = prompt('Enter your date of birth: (dd/mm/yyyy)', 'dd/mm/yyyy')
    if (age.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)) {
        const dobString = age.split('\/')
        const dob = new Date()
        dob.setDate(dobString[0])
        dob.setMonth(dobString[1] === '01' ? 0: parseInt(dobString[1]) - 1)
        dob.setFullYear(dobString[2])

        const ageElement = document.createElement('h1')
        wrapper.appendChild(ageElement)

        setInterval(() => {
            const today = new Date()
            const second = today.getSeconds()
            const minute = today.getMinutes()
            const hour = today.getHours()

            const day = (function () {
                if (today.getDate() > dob.getDate()) {
                    return today.getDate() - dob.getDate() - 1;
                } else if (today.getDate() === dob.getDate()) {
                    return today.getDate() - dob.getDate();
                } else {
                    let calDate = new Date(dob.getFullYear(), dob.getMonth() + 1, 0)
                    return (today.getDate() + calDate.getDate()) - dob.getDate() - 1
                }
            }());

            const month = (function () {
                if (today.getMonth() >= dob.getMonth()) {
                    if (today.getDate() >= dob.getDate()) {
                        return today.getMonth() - dob.getMonth()
                    } else {
                        if((today.getMonth() - 1) >= dob.getMonth()) {
                            return (today.getMonth() - 1) - dob.getMonth()
                        } else {
                            return ((today.getMonth() - 1) + 12) - dob.getMonth()
                        }
                    }
                } else {
                    if(today.getDate() >= dob.getDate()) {
                        return (today.getMonth() + 12) - dob.getMonth()
                    } else {
                        return ((today.getMonth() - 1) + 12) - dob.getMonth()
                    }
                }
            }());

            const year = (function () {
                if (dob.getMonth() === today.getMonth()) {
                    if (dob.getDate() > today.getDate()) {
                        return (today.getFullYear() - 1) - dob.getFullYear()
                    } else {
                        return today.getFullYear() - dob.getFullYear()
                    }
                } else {
                    if (dob.getMonth() > today.getMonth()) {
                        return (today.getFullYear() - 1) - dob.getFullYear()
                    } else {
                        return today.getFullYear() - dob.getFullYear()
                    }
                }
            }());

            ageElement.innerText = `Your age: ${year} years ${month} months ${day} days ${hour} hours ${minute} minutes ${second} seconds`
        }, 1000)
    } else {
        displayAge()
    }
}

displayAge()