from functools import lru_cache
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logos  = {
    'TataAIG': "https://www.tataaig.com/logo-min.png",
    'Chola': "https://www.cholainsurance.com/o/chola-corporate-theme/images/logo.png",
    'BOB': "https://www.bankofbaroda-usa.com/-/media/project/bob/countrywebsites/usa/logo/bob-logo-usa.svg",
    'GoDigit': "https://d2h44aw7l5xdvz.cloudfront.net/assets/logos/digit.svg",
    'Acko': "https://acko-brand.ackoassets.com/brand/vector-svg/gradient/horizontal-reverse.svg"
}

@app.get("/plans")    
def get_premiums(
    gender: Optional[str] = 'Male',
    location: Optional[str] = 'Urban',
    sumInsured: Optional[str] = '0',
    ageGroup: Optional[str] = '18-24',
    planType: Optional[str] = 'Health',
):
    # Extract age from age group (taking the lower bound)
    age = int(ageGroup.split('-')[1]) if ageGroup else 0
    
    # Simulate DB query
    insurers = ['TataAIG', 'Chola', 'BOB', 'GoDigit', 'Acko']
    return [{
        "name": planType,
        "insurer": insurer,
        "premium": calculate_premium(age, gender, sumInsured, location, insurer, planType),
        "insurer_img": logos[insurer],
        "learn_more": "".join(logos[insurer].split("/")[:3])
    } for insurer in insurers if calculate_premium(age, gender, sumInsured, location, insurer, planType) > 0]


@lru_cache
def calculate_premium(age: int, gender: str, sum_insured: int, location: str, insurer: str, type: str) -> float:
    base_premium = float(sum_insured) * 0.01
    multiplier = {
        'TataAIG': 1.0,
        'Chola': 1.2,
        'BOB': 1.3,
        'GoDigit': 1.1,
        'Acko': 1.0
    }

    # Apply insurer multiplier
    premium = base_premium * multiplier[insurer]

    # Age-based discount for TataAIG
    if insurer == 'TataAIG' and age < 30:
        premium *= 0.9

    # Gender-based discount
    if gender.lower() in ['female', 'f', 'women']:
        premium *= 0.9

    # Location-based discount
    if location.lower() == 'urban' and insurer in ['Acko', 'Chola']:
        premium *= 0.95
    
    if type == 'Health':
        premium *= 0.90
    
    if type == 'Fire' and insurer == 'BOB':
        premium *= 5.50
    elif type == 'Fire':
        premium = 0

    return round(premium, 2)

