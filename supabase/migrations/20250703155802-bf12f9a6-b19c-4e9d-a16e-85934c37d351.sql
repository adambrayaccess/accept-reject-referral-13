-- Generate sample pharmacy details data for patients
-- Get patient IDs to work with
WITH sample_patients AS (
    SELECT id FROM public.patients 
    WHERE active = true 
    LIMIT 20
),
patient_list AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn FROM sample_patients
)

-- Insert pharmacy details for patients
INSERT INTO public.pharmacy_details (
    patient_id, 
    name, 
    address, 
    phone, 
    email,
    pharmacy_type
) 
-- Main nominated pharmacies
SELECT 
    p.id,
    CASE p.rn
        WHEN 1 THEN 'Boots Pharmacy - Oxford Street'
        WHEN 2 THEN 'Lloyds Pharmacy - Manchester Central'
        WHEN 3 THEN 'Superdrug Pharmacy - Edinburgh Princes Street'
        WHEN 4 THEN 'Asda Pharmacy - Cardiff Bay'
        WHEN 5 THEN 'Tesco Pharmacy - Birmingham City Centre'
        WHEN 6 THEN 'Morrisons Pharmacy - Leeds Headingley'
        WHEN 7 THEN 'Sainsbury''s Pharmacy - Glasgow Merchant City'
        WHEN 8 THEN 'Well Pharmacy - Newcastle Grainger Street'
        WHEN 9 THEN 'Rowlands Pharmacy - Bristol Temple Meads'
        WHEN 10 THEN 'Day Lewis Pharmacy - Liverpool One'
        WHEN 11 THEN 'Independent Pharmacy - Sheffield Ecclesall Road'
        WHEN 12 THEN 'Cohens Chemist - Leicester Granby Street'
        WHEN 13 THEN 'Moss Pharmacy - Nottingham Victoria Centre'
        WHEN 14 THEN 'Jhoots Pharmacy - Coventry City Centre'
        WHEN 15 THEN 'Pharmacy First - Hull Spring Bank'
        WHEN 16 THEN 'Green Light Pharmacy - Plymouth Barbican'
        WHEN 17 THEN 'Your Local Pharmacy - Stoke-on-Trent'
        WHEN 18 THEN 'Peak Pharmacy - Derby Sadler Gate'
        WHEN 19 THEN 'Whitworths Pharmacy - Southampton High Street'
        WHEN 20 THEN 'Portway Pharmacy - Portsmouth Commercial Road'
        ELSE 'Local Pharmacy'
    END,
    CASE p.rn
        WHEN 1 THEN '150 Oxford Street, London, W1D 1NB'
        WHEN 2 THEN '42 Market Street, Manchester, M1 1PW'
        WHEN 3 THEN '104 Princes Street, Edinburgh, EH2 3AA'
        WHEN 4 THEN 'Unit 12, Red Dragon Centre, Cardiff, CF10 4GA'
        WHEN 5 THEN '25 New Street, Birmingham, B2 4BF'
        WHEN 6 THEN '67 Headingley Lane, Leeds, LS6 1DP'
        WHEN 7 THEN '158 Ingram Street, Glasgow, G1 1EJ'
        WHEN 8 THEN '89 Grainger Street, Newcastle, NE1 5JE'
        WHEN 9 THEN 'Temple Meads Station, Bristol, BS1 6QF'
        WHEN 10 THEN '5 Paradise Street, Liverpool, L1 8JF'
        WHEN 11 THEN '234 Ecclesall Road, Sheffield, S11 8NX'
        WHEN 12 THEN '45 Granby Street, Leicester, LE1 6FB'
        WHEN 13 THEN 'Victoria Centre, Nottingham, NG1 3QN'
        WHEN 14 THEN '7 Hertford Street, Coventry, CV1 1LF'
        WHEN 15 THEN '123 Spring Bank, Hull, HU3 1AF'
        WHEN 16 THEN '34 The Barbican, Plymouth, PL1 2LR'
        WHEN 17 THEN '56 Piccadilly, Stoke-on-Trent, ST1 1HR'
        WHEN 18 THEN '78 Sadler Gate, Derby, DE1 3NQ'
        WHEN 19 THEN '91 Above Bar Street, Southampton, SO14 7DX'
        WHEN 20 THEN '156 Commercial Road, Portsmouth, PO1 1EX'
        ELSE '1 High Street, City, XX1 1XX'
    END,
    CASE p.rn
        WHEN 1 THEN '020 7629 6557'
        WHEN 2 THEN '0161 834 7209'
        WHEN 3 THEN '0131 225 6757'
        WHEN 4 THEN '029 2022 7788'
        WHEN 5 THEN '0121 632 1004'
        WHEN 6 THEN '0113 274 6636'
        WHEN 7 THEN '0141 552 5893'
        WHEN 8 THEN '0191 232 6420'
        WHEN 9 THEN '0117 929 8877'
        WHEN 10 THEN '0151 709 7001'
        WHEN 11 THEN '0114 266 8800'
        WHEN 12 THEN '0116 251 4040'
        WHEN 13 THEN '0115 947 5151'
        WHEN 14 THEN '024 7622 7722'
        WHEN 15 THEN '01482 329 696'
        WHEN 16 THEN '01752 266 754'
        WHEN 17 THEN '01782 212 343'
        WHEN 18 THEN '01332 343 434'
        WHEN 19 THEN '023 8022 7331'
        WHEN 20 THEN '023 9282 6116'
        ELSE '01234 567890'
    END,
    CASE p.rn
        WHEN 1 THEN 'oxford.street@boots.co.uk'
        WHEN 2 THEN 'manchester.central@lloydspharmacy.co.uk'
        WHEN 3 THEN 'edinburgh.princes@superdrug.com'
        WHEN 4 THEN 'cardiff.bay@asda.co.uk'
        WHEN 5 THEN 'birmingham.city@tesco.com'
        WHEN 6 THEN 'leeds.headingley@morrisons.co.uk'
        WHEN 7 THEN 'glasgow.merchant@sainsburys.co.uk'
        WHEN 8 THEN 'newcastle.grainger@well.co.uk'
        WHEN 9 THEN 'bristol.temple@rowlandspharmacy.co.uk'
        WHEN 10 THEN 'liverpool.one@daylewis.co.uk'
        WHEN 11 THEN 'sheffield@independentpharmacy.co.uk'
        WHEN 12 THEN 'leicester@cohenschemist.co.uk'
        WHEN 13 THEN 'nottingham@mosspharmacy.co.uk'
        WHEN 14 THEN 'coventry@jhoots.co.uk'
        WHEN 15 THEN 'hull@pharmacyfirst.co.uk'
        WHEN 16 THEN 'plymouth@greenlightpharmacy.co.uk'
        WHEN 17 THEN 'stoke@yourlocalpharmacy.co.uk'
        WHEN 18 THEN 'derby@peakpharmacy.co.uk'
        WHEN 19 THEN 'southampton@whitworths.co.uk'
        WHEN 20 THEN 'portsmouth@portwayPharmacy.co.uk'
        ELSE 'pharmacy@email.co.uk'
    END,
    'nominated'
FROM patient_list p

UNION ALL

-- Some linked pharmacies (for patients who use multiple pharmacies)
SELECT 
    p.id,
    CASE p.rn
        WHEN 3 THEN 'Boots Pharmacy - Edinburgh Cameron Toll'
        WHEN 7 THEN 'Lloyds Pharmacy - Glasgow West End'
        WHEN 12 THEN 'Superdrug Pharmacy - Leicester Fosse Park'
        WHEN 16 THEN 'Asda Pharmacy - Plymouth Estover'
        WHEN 19 THEN 'Tesco Pharmacy - Southampton Millbrook'
        ELSE 'Secondary Pharmacy'
    END,
    CASE p.rn
        WHEN 3 THEN 'Cameron Toll Shopping Centre, Edinburgh, EH16 5PB'
        WHEN 7 THEN '789 Great Western Road, Glasgow, G12 8QX'
        WHEN 12 THEN 'Fosse Park, Leicester, LE19 1HX'
        WHEN 16 THEN 'Estover Retail Park, Plymouth, PL6 7PY'
        WHEN 19 THEN 'Millbrook Road West, Southampton, SO15 0HW'
        ELSE 'Secondary Address'
    END,
    CASE p.rn
        WHEN 3 THEN '0131 664 2977'
        WHEN 7 THEN '0141 339 7722'
        WHEN 12 THEN '0116 263 1199'
        WHEN 16 THEN '01752 765 432'
        WHEN 19 THEN '023 8077 8899'
        ELSE '01234 567891'
    END,
    CASE p.rn
        WHEN 3 THEN 'cameron.toll@boots.co.uk'
        WHEN 7 THEN 'glasgow.west@lloydspharmacy.co.uk'
        WHEN 12 THEN 'leicester.fosse@superdrug.com'
        WHEN 16 THEN 'plymouth.estover@asda.co.uk'
        WHEN 19 THEN 'southampton.millbrook@tesco.com'
        ELSE 'secondary@pharmacy.co.uk'
    END,
    'linked'
FROM patient_list p
WHERE p.rn IN (3, 7, 12, 16, 19)

UNION ALL

-- Hospital pharmacies (for some patients)
SELECT 
    p.id,
    CASE p.rn
        WHEN 2 THEN 'Manchester Royal Infirmary Pharmacy'
        WHEN 5 THEN 'Queen Elizabeth Hospital Birmingham Pharmacy'
        WHEN 8 THEN 'Royal Victoria Infirmary Newcastle Pharmacy'
        WHEN 14 THEN 'University Hospital Coventry Pharmacy'
        WHEN 17 THEN 'Royal Stoke Hospital Pharmacy'
        ELSE 'Hospital Pharmacy'
    END,
    CASE p.rn
        WHEN 2 THEN 'Oxford Road, Manchester, M13 9WL'
        WHEN 5 THEN 'Mindelsohn Way, Birmingham, B15 2GW'
        WHEN 8 THEN 'Queen Victoria Road, Newcastle, NE1 4LP'
        WHEN 14 THEN 'Clifford Bridge Road, Coventry, CV2 2DX'
        WHEN 17 THEN 'Newcastle Road, Stoke-on-Trent, ST4 6QG'
        ELSE 'Hospital Road, City, XX1 2YY'
    END,
    CASE p.rn
        WHEN 2 THEN '0161 276 1234'
        WHEN 5 THEN '0121 371 2000'
        WHEN 8 THEN '0191 233 6161'
        WHEN 14 THEN '024 7696 4000'
        WHEN 17 THEN '01782 715444'
        ELSE '01234 567892'
    END,
    CASE p.rn
        WHEN 2 THEN 'pharmacy@mri.nhs.uk'
        WHEN 5 THEN 'pharmacy@uhb.nhs.uk'
        WHEN 8 THEN 'pharmacy@nuth.nhs.uk'
        WHEN 14 THEN 'pharmacy@uhcw.nhs.uk'
        WHEN 17 THEN 'pharmacy@uhnm.nhs.uk'
        ELSE 'pharmacy@hospital.nhs.uk'
    END,
    'linked'
FROM patient_list p
WHERE p.rn IN (2, 5, 8, 14, 17);