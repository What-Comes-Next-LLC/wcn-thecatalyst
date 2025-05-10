import csv
import random
from datetime import datetime, timedelta
import uuid

# Constants based on validation rules
MIN_AGE = 13
MAX_AGE = 120
MIN_HEIGHT = 48  # 4 feet
MAX_HEIGHT = 96  # 8 feet
MIN_WEIGHT = 50
MAX_WEIGHT = 1000

# Sample data for variety
first_names = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
    "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
    "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Margaret", "Anthony", "Betty", "Donald", "Sandra",
    "Mark", "Ashley", "Paul", "Dorothy", "Steven", "Kimberly", "Andrew", "Emily", "Joshua", "Donna",
    "Kenneth", "Michelle", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Edward", "Deborah"
]

last_names = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
]

goals = [
    "I want to lose 20 pounds and build muscle mass through strength training",
    "Looking to improve my overall fitness and energy levels through regular exercise",
    "Need to develop a sustainable workout routine that fits my busy schedule",
    "Want to increase my strength and endurance for upcoming marathon training",
    "Seeking to transform my body composition and build lean muscle mass",
    "Looking to improve my flexibility and reduce back pain through exercise",
    "Want to develop better eating habits and create a balanced fitness routine",
    "Need to lose weight and improve my cardiovascular health",
    "Looking to build strength and confidence through consistent training",
    "Want to improve my athletic performance and recovery time"
]

notes = [
    "I have a minor knee injury from running that needs consideration",
    "Available for training during early morning hours only",
    "Prefer outdoor workouts when possible",
    "Have access to a home gym with basic equipment",
    "Need to focus on low-impact exercises due to joint issues",
    "Interested in group training sessions",
    "Have previous experience with weight training",
    "Need help with proper form and technique",
    "Looking for a sustainable long-term fitness plan",
    "Have dietary restrictions that need to be considered"
]

def generate_sample_data(num_records=45):
    records = []
    base_date = datetime.now() - timedelta(days=30)  # Start from 30 days ago
    
    for i in range(num_records):
        # Generate random name
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        name = f"{first_name} {last_name}"
        
        # Generate email based on name
        email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 999)}@example.com"
        
        # Generate random phone number
        phone = f"({random.randint(200, 999)}) {random.randint(200, 999)}-{random.randint(1000, 9999)}"
        
        # Generate random age, height, and weight within valid ranges
        age = random.randint(MIN_AGE, MAX_AGE)
        height = random.randint(MIN_HEIGHT, MAX_HEIGHT)
        weight = random.randint(MIN_WEIGHT, MAX_WEIGHT)
        
        # Generate random goal and notes
        goal = random.choice(goals)
        note = random.choice(notes) if random.random() < 0.7 else ""  # 70% chance of having notes
        
        # Generate random submission date within the last 30 days
        submission_date = base_date + timedelta(days=random.randint(0, 30))
        
        # Randomly assign status (70% pending, 30% active)
        status = "active" if random.random() < 0.3 else "pending"
        
        record = {
            "Name": name,
            "Email": email,
            "Phone": phone,
            "Age": age,
            "Height": height,
            "Weight": weight,
            "Goal": goal,
            "Notes": note,
            "Created At": submission_date.isoformat(),
            "Status": status
        }
        
        records.append(record)
    
    return records

def write_to_csv(records, filename="sample_intake_data.csv"):
    fieldnames = ["Name", "Email", "Phone", "Age", "Height", "Weight", "Goal", "Notes", "Created At", "Status"]
    
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

if __name__ == "__main__":
    records = generate_sample_data()
    write_to_csv(records)
    print(f"Generated {len(records)} sample records in sample_intake_data.csv") 