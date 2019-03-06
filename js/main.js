/*
teamNumber : {
    type: Number,
        required: true
},
matchNumber : {
    type: Number,
        required: true
},
scouter : {
    type: String,
        required: true
},
timestamp : {
    type: Number,
        required: true
},

sandstorm: {
    habStart : {
        type: Number,
            required: true
    },
    crossHab : {
        type: Boolean,
            required: true
    },
    rocket: {
        hatchPanels: {
            type: Boolean,
                required: true
        },
        balls: {
            type: Boolean,
                required: true
        }
    },
    cargoShip: {
        hatchPanels: {
            type: Boolean,
                required: true
        },
        balls: {
            type: Boolean,
                required: true
        }
    }
},

match: {
    rocket3: {
        hatchPanels: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        },
        balls: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        }
    },
    rocket2: {
        hatchPanels: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        },
        balls: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        }
    },
    rocket1: {
        hatchPanels: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        },
        balls: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        }
    },
    cargoShip: {
        hatchPanels: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        },
        balls: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        }
    }
},

climb: {
    habClimbLevel: {
        type: Number,
            required: true
    },
    speedOfClimb: {
        type: Number,
            required: true
    },
    reliability: {
        type: Number,
            required: true
    }
},

comments: {
    comments: {
        type: String
    },
    strengths: {
        type: String
    },
    weaknesses: {
        type: String
    }
}
*
* Name: habStart
* Name: crossLine
* Name: climbLevel
* Name: reliability
*
* teamNumber
* matchPrefix
* matchNumber
* cargoShipCargo
* cargoShipHatchPanel
* rocketCargo
* rocketHatchPanel
*
*
* cargoShipCargoSuccess
* cargoShipCargoFail
* cargoShipHPSuccess
* cargoShipHPFail
*
* rocket1ShipCargoSuccess
* rocket1ShipCargoFail
* rocket1ShipHPSuccess
* rocket1ShipHPFail
*
* rocket2ShipCargoSuccess
* rocket2ShipCargoFail
* rocket2ShipHPSuccess
* rocket2ShipHPFail
*
* rocket3ShipCargoSuccess
* rocket3ShipCargoFail
* rocket3ShipHPSuccess
* rocket3ShipHPFail
*
*
* climbSpeed
*
*
* save
*
* comments
* strengths
* weaknesses
*
* */

$(document).ready(function () {

    var fields = {
        "radio" : ["climbLevel", "reliability", "crossLine", "habStart"],
        "general" : ["teamNumber", "matchPrefix", "matchNumber", "cargoShipCargoSuccess", "cargoShipCargoFail", "cargoShipHPSuccess", "cargoShipHPFail", "rocket1CargoSuccess", "rocket1CargoFail", "rocket1HPSuccess", "rocket1HPFail", "rocket2CargoSuccess", "rocket2CargoFail", "rocket2HPSuccess", "rocket2HPFail", "rocket3CargoSuccess", "rocket3CargoFail", "rocket3HPSuccess", "rocket3HPFail", "climbSpeed", "comments", "strengths", "weaknesses"],
        "checkbox" : ["cargoShipCargo", "cargoShipHatchPanel", "rocketCargo", "rocketHatchPanel"]
    }

    function injectData(data) {
        for (var i in fields["radio"]) {
            var id = fields["radio"][i]

            $('#' + id + data[id]).prop('checked',true)
        }

        for (var i in fields["general"]) {
            var id = fields["general"][i]

            $('#' + id).val(data[id])
        }

        for (var i in fields["checkbox"]) {
            var id = fields["checkbox"][i]

            $('#' + id).prop('checked', data[id])
        }
    }

    function extractData() {

        var out = {};

        for (var i in fields["radio"]) {
            var id = fields["radio"][i]

            out[id] = $('input[name=' + id + ']:checked').val()
        }

        for (var i in fields["general"]) {
            var id = fields["general"][i]

            out[id] = $('#' + id).val()
        }

        for (var i in fields["checkbox"]) {
            var id = fields["checkbox"][i]

            out[id] = $('#' + id).is(":checked")
        }

        return out;

    }

    if (localStorage.username) {
        $('#current-event').html(localStorage.currentEvent + ' EVENT')
    }

    function getLocalStorage() {
        try {
            return JSON.parse(localStorage.scoutingData)
        } catch (e) {
            return {}
        }
    }

    function setLocalStorage(data) {
        localStorage.scoutingData = JSON.stringify(data)
    }

    function addEntry (team, match, data) {

        /*
        * Data structure
        * teams
        * |-4903
        *   |-Match #1
        *       |-Some nice data
        * */

        var localData = getLocalStorage()

        if (!localData.hasOwnProperty(team)) {
            localData[team] = {}
        }

        localData[team][match] = data

        setLocalStorage(localData)

    }

    $('#save').on('click', function() {
        var data = extractData()

        addEntry(data['teamNumber'], data['matchPrefix'] + data['matchNumber'], data)

        swal('Saved', 'I think it\'s saved', 'success');


    })

    $('#saveEventName').on('click', function() {

        if ($('#eventName').val()) {
            localStorage.currentEvent = $('#eventName').val().toUpperCase()

            $('#current-event').html(localStorage.currentEvent + ' EVENT')


            swal('Event Name Saved', 'Event name set to: ' + localStorage.currentEvent, 'success')
        } else {
            swal('Error', 'Bro you can\'t set event name to nothing!', 'error')
        }
    })


    $('#sync').on('click', function() {
        injectData(getLocalStorage()['4903']['Q118'])
    })
});