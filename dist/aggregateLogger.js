"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
class AggregateLogger {
    constructor(loggers) {
        this._loggers = loggers;
    }
    banner(message) {
        if (this._loggers) {
            this._loggers.forEach(logger => logger.banner(message));
        }
    }
    info(message, args) {
        if (this._loggers) {
            this._loggers.forEach(logger => logger.info(message, args));
        }
    }
    warning(message, args) {
        if (this._loggers) {
            this._loggers.forEach(logger => logger.warning(message, args));
        }
    }
    error(message, err, args) {
        if (this._loggers) {
            this._loggers.forEach(logger => logger.error(message, err, args));
        }
    }
}
exports.AggregateLogger = AggregateLogger;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZ2dyZWdhdGVMb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSw0QkFBNEI7QUFDNUI7SUFHSSxZQUFZLE9BQWtCO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFTSxNQUFNLENBQUMsT0FBZTtRQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUM7SUFDTCxDQUFDO0lBRU0sSUFBSSxDQUFDLE9BQWUsRUFBRSxJQUE0QjtRQUNyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNoRSxDQUFDO0lBQ0wsQ0FBQztJQUVNLE9BQU8sQ0FBQyxPQUFlLEVBQUUsSUFBNEI7UUFDeEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbkUsQ0FBQztJQUNMLENBQUM7SUFFTSxLQUFLLENBQUMsT0FBZSxFQUFFLEdBQVMsRUFBRSxJQUE0QjtRQUNqRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdEUsQ0FBQztJQUNMLENBQUM7Q0FDSjtBQTlCRCwwQ0E4QkMiLCJmaWxlIjoiYWdncmVnYXRlTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6Ii4uL3NyYyJ9
