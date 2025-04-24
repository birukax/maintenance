YESNO = ((True, "Yes"), (False, "No"))
YES_NO_NONE = ((True, "Yes"), (False, "No"), (None, "-"))
ITEM_TYPES = (("MECHANICAL", "MECHANICAL"), ("ELECTRICAL", "ELECTRICAL"))
ITEM_CATEGORIES = (("TOOL", "TOOL"), ("SPAREPART", "SPAREPART"))
MONTH_NAMES = (
    (1, "JANUARY"),
    (2, "FEBRUARY"),
    (3, "MARCH"),
    (4, "APRIL"),
    (5, "MAY"),
    (6, "JUNE"),
    (7, "JULY"),
    (8, "AUGUST"),
    (9, "SEPTEMBER"),
    (10, "OCTOBER"),
    (11, "NOVEMBER"),
    (12, "DECEMBER"),
)

APPROVAL_STATUS = (
    ("PENDING", "PENDING"),
    ("REJECTED", "REJECTED"),
    ("APPROVED", "APPROVED"),
    ("CANCELED", "CANCELED"),
)

PRIORITIES = (
    ("URGENT", "URGENT"),
    ("HIGH", "HIGH"),
    ("MEDIUM", "MEDIUM"),
    ("LOW", "LOW"),
)

PURCHASE_STATUS = (
    ("PENDING-APPROVAL", "PENDING-APPROVAL"),
    ("APPROVED", "APPROVED"),
    ("REJECTED", "REJECTED"),
    ("RECEIVED", "RECEIVED"),
)

WORK_ORDER_TYPES = (
    ("PM01", "Failure Work-Order"),
    ("PM02", "Inspection Based Work-Order"),
    ("PM03", "Scheduled Work-Order"),
    ("PM04", "Project Work-Order"),
)

WORK_ORDER_STATUS = (
    ("Requested", "Requested"),
    ("Accepted", "Accepted"),
    ("Created", "Created"),
    ("Assigned", "Assigned"),
    ("Incomplete", "Incomplete"),
    ("Completed", "Completed"),
)
SCHEDULE_TYPES = (
    ("DAILY", "DAILY"),
    ("WEEKLY", "WEEKLY"),
    ("MONTHLY", "MONTHLY"),
    ("YEARLY", "YEARLY"),
)


ROLES = (
    ("USER", "USER"),
    ("ADMIN", "ADMIN"),
    ("MANAGER", "MANAGER"),
    ("PLANNER", "PLANNER"),
    ("SUPERVISOR", "SUPERVISOR"),
    ("ENGINEER", "ENGINEER"),
)
