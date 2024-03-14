const Attendance = require("../models/attendance");
const Sequelize = require("sequelize");

exports.postScanQRCode = async (req, res, next) => {
  try {
    const employeeId = req.body.message;
    console.log(employeeId);
    const currentDate = new Date();
    const formattedCurrentDate = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
    const formattedCurrentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    const { count, rows: attendances } = await Attendance.findAndCountAll({
      where: { employeeId: employeeId, attendanceDate: formattedCurrentDate },
    });

    if (count === 0) {
      await Attendance.create({
        attendanceDate: formattedCurrentDate,
        startTime: formattedCurrentTime,
        modeAdded: "qrCode",
        employeeId: employeeId,
      });
    } else if (count === 1) {
      if (attendances[0].endTime === null) {
        const timeDifference =
          (new Date(`2000-01-01T${formattedCurrentTime}`) -
            new Date(`2000-01-01T${attendances[0].startTime}`)) /
          (1000 * 60 * 60);
        await attendances[0].update({
          endTime: formattedCurrentTime,
          workedTime: timeDifference,
        });
      } else {
        await Attendance.create({
          attendanceDate: formattedCurrentDate,
          startTime: formattedCurrentTime,
          modeAdded: "qrCode",
          employeeId: employeeId,
        });
      }
    } else if (count === 2) {
      check = 0;
      for (index = 0; index < count; index++)
        if (attendances[index].endTime == null) {
          // console.log(attendances[index].startTime);
          const timeDifference =
            (new Date(`2000-01-01T${formattedCurrentTime}`) -
              new Date(`2000-01-01T${attendances[index].startTime}`)) /
            (1000 * 60 * 60);
          // console.log(timeDifference);
          await attendances[index].update({
            endTime: formattedCurrentTime,
            workedTime: timeDifference,
          });
          check = 1;
        }
      if (check === 0) {
        res.status(403).json({ error: "Too many attendances for one day" });
        return;
      }
    }
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
