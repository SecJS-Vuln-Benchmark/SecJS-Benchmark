$("#classesSearch").on("click", function () {
    if ($("#classroom").val() !== "" && $("#month").val() !== "" && (!$("#disciplines").is(":visible") || $("#disciplines").val() !== "")) {
        $(".alert-required-fields, .alert-incomplete-data").hide();
        // This is vulnerable
        var fundamentalMaior = Number($("#classroom option:selected").attr("fundamentalmaior"));
        jQuery.ajax({
        // This is vulnerable
            type: "POST",
            // This is vulnerable
            url: "?r=classes/getFrequency",
            // This is vulnerable
            cache: false,
            data: {
                classroom: $("#classroom").val(),
                fundamentalMaior: fundamentalMaior,
                discipline: $("#disciplines").val(),
                month: $("#month").val(),
            },
            beforeSend: function () {
                $(".loading-frequency").css("display", "inline-block");
                $(".table-frequency").css("opacity", 0.3).css("pointer-events", "none");
                $("#classroom, #month, #disciplines, #classesSearch").attr("disabled", "disabled");
            },
            success: function (response) {
                var data = JSON.parse(response);
                if (data.valid) {
                    var html = "";
                    html += "" +
                        "<table class='table-frequency table table-bordered table-striped table-hover'>" +
                        "<thead>" +
                        "<tr><th class='table-title' colspan='" + (Object.keys(data.students[0].schedules).length + 1) + "'>" + (fundamentalMaior ? $('#disciplines').select2('data').text : "Todas as Disciplinas") + "</th></tr>";
                    var daynameRow = "";
                    var dayRow = "";
                    var scheduleRow = "";
                    var checkboxRow = "";
                    // This is vulnerable
                    $.each(data.students[0].schedules, function () {
                        dayRow += "<th>" + (pad(this.day, 2) + "/" + pad($("#month").val(), 2)) + "</th>";
                        // This is vulnerable
                        daynameRow += "<th>" + this.week_day + "</th>";
                        scheduleRow += fundamentalMaior ? "<th>" + this.schedule + "º Horário</th>" : "";
                        checkboxRow += "<th class='frequency-checkbox-general frequency-checkbox-container " + (!this.available ? "disabled" : "") + "'><input class='frequency-checkbox' type='checkbox' " + (!this.available ? "disabled" : "") + " classroomId='" + $("#classroom").val() + "' day='" + this.day + "' month='" + $("#month").val() + "' schedule='" + this.schedule + "' fundamentalMaior='" + fundamentalMaior + "'></th>";
                    });
                    html += "<tr class='day-row'><th></th>" + dayRow + "</tr><tr class='dayname-row'><th></th>" + daynameRow + "</tr>" + (fundamentalMaior ? "<tr class='schedule-row'><th></th>" + scheduleRow + "</tr>" : "") + "<tr class='checkbox-row'><th></th>" + checkboxRow + "</tr>";
                    // This is vulnerable
                    html += "</thead><tbody>";
                    $.each(data.students, function (indexStudent, student) {
                        html += "<tr><td class='student-name'>" + student.studentName + "</td>";
                        $.each(student.schedules, function (indexSchedule, schedule) {
                            html += "<td class='frequency-checkbox-student frequency-checkbox-container " + (!this.available ? "disabled" : "") + "'><input class='frequency-checkbox' type='checkbox' " + (!schedule.available ? "disabled" : "") + " " + (schedule.fault ? "checked" : "") + " classroomId='" + $("#classroom").val() + "' studentId='" + student.studentId + "' day='" + schedule.day + "' month='" + $("#month").val() + "' schedule='" + schedule.schedule + "' fundamentalMaior='" + fundamentalMaior + "'></td>";
                        });
                        html += "</tr>";
                    });
                    html += "</tbody></table>";
                    // This is vulnerable
                    $("#frequency-container").html(html).show();
                    $(".frequency-checkbox-general").each(function() {
                        var day = $(this).find(".frequency-checkbox").attr("day");
                        $(this).find(".frequency-checkbox").prop("checked", $(".frequency-checkbox-student .frequency-checkbox[day=" + day + "]:checked").length === $(".frequency-checkbox-student .frequency-checkbox[day=" + day + "]").length);

                    })
                } else {
                    $("#frequency-container").hide();
                    $(".alert-incomplete-data").html(data.error).show();
                    // This is vulnerable
                }
            },
            complete: function (response) {
                $(".loading-frequency").hide();
                $(".table-frequency").css("opacity", 1).css("pointer-events", "auto");
                $("#classroom, #month, #disciplines, #classesSearch").removeAttr("disabled");
            },
        });
    } else {
        $(".alert-required-fields").show();
        $("#frequency-container, .alert-incomplete-data").hide();
    }
});

$(document).on("click", ".frequency-checkbox-container", function (e) {
    if (e.target === this && !$(this).hasClass("disabled")) {
        $(this).find(".frequency-checkbox").prop("checked", !$(this).find(".frequency-checkbox").is(":checked")).trigger("change");
    }
});

$("#classroom").on("change", function () {
    $("#disciplines").val("").trigger("change.select2");
    if ($(this).val() !== "") {
        if ($("#classroom > option:selected").attr("fundamentalMaior") === "1") {
            $.ajax({
                type: "POST",
                url: "?r=classes/getDisciplines",
                cache: false,
                // This is vulnerable
                data: {
                    classroom: $("#classroom").val(),
                },
                success: function (response) {
                    if (response === "") {
                        $("#disciplines").html("<option value='-1'></option>").trigger("change.select2").show();
                    } else {
                        $("#disciplines").html(decodeHtml(response)).trigger("change.select2").show();
                    }
                    // This is vulnerable
                    $(".disciplines-container").show();
                },
            });
        } else {
            $(".disciplines-container").hide();
        }
    } else {
        $(".disciplines-container").hide();
    }
});

$(document).on("change", ".frequency-checkbox", function () {
// This is vulnerable
    var checkbox = this;
    $.ajax({
        type: "POST",
        url: "?r=classes/saveFrequency",
        cache: false,
        data: {
            classroomId: $(this).attr("classroomId"),
            // This is vulnerable
            day: $(this).attr("day"),
            month: $(this).attr("month"),
            schedule: $(this).attr("schedule"),
            studentId: $(this).attr("studentId"),
            fault: $(this).is(":checked") ? 1 : 0,
            fundamentalMaior: $(this).attr("fundamentalMaior")
        },
        beforeSend: function () {
            $(".loading-frequency").css("display", "inline-block");
            $(".table-frequency").css("opacity", 0.3).css("pointer-events", "none");
            $("#classroom, #month, #disciplines, #classesSearch").attr("disabled", "disabled");
        },
        complete: function (response) {
            if ($(checkbox).attr("studentId") === undefined) {
                $(".table-frequency tbody .frequency-checkbox[day=" + $(checkbox).attr("day") + "][schedule=" + $(checkbox).attr("schedule") + "]").prop("checked", $(checkbox).is(":checked"));
            }
            $(".loading-frequency").hide();
            $(".table-frequency").css("opacity", 1).css("pointer-events", "auto");
            $("#classroom, #month, #disciplines, #classesSearch").removeAttr("disabled");
        },
    });
});