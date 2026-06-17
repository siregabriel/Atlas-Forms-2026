import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion as Motion } from 'framer-motion';

const CONFIG = {
  nombre: "Atlas Senior Living Forms Hub",
  passwordCorrecto: "Atlas2026",
  emailSoporte: "grosales@atlasseniorliving.com",
  version: "1.4.5" // Update: Drag & Drop Fixed & Robust
};

// --- BASE DE DATOS ---
const DOCUMENTOS = [
  { id: 40, nombre: "Workplace Violence Policy.docx", letra: "W", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCxU4xShBtmSayU2CAnSh50AWkYulJ8HnXWk10-GpyN1iE?CID=0c98beb9-3937-ac3f-f8c8-836dcc07fc97", departamento: "Clinical Policy" },
  { id: 50, nombre: "Work Injury Reporting.docx", letra: "W", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQA2u2UWaq0HS4Z6z6yk4l6JAWsSyHeBJO_kqeSgTC_SQTA?CID=6b185510-2285-3456-baf6-56060d1f0e36", departamento: "Clinical Policy" },
  { id: 60, nombre: "Alexa Speak2 Codes.pdf", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:b:/p/grosales/IQBmWkt2raozRa4402TYpvtqAQETVbEw32trr2Ch6dstAwM?e=SdiFCJ", departamento: "" },
  { id: 70, nombre: "Atlas Levels of Care.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDxCI4iiAO8Qb1xU5cTZtjyAdzUl9c8q8EJ4agxDOuteKM?e=ZRFmh8", departamento: "" },
  { id: 93, nombre: "Reportable Events.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBpBiQKpebRTIyiFc99cSY3AS2Z5CzmrAN3N1-wncwMBMg?e=2jif8e", departamento: "Clinical Policy" },
  { id: 94, nombre: "Resident Refusals.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAHQHp14XW9QJVeqaG0MZBFAXNz9CzRj65UPzKzECGewYI?CID=53d6ca64-5017-15a8-2a5d-973106f8fe67", departamento: "Clinical Policy" },
  { id: 95, nombre: "Alexa Speak2 Consent Form.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCOVTG_FDn4TrjjahGgY0rpAR16fnGe5uKsG5YsaJtxRYQ?e=NX1bmN", departamento: "" },
  { id: 96, nombre: "ADL Care Plan.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAndTq7qaihQrFMQxPf5C7hAXN8RjWuv-tYMcjhS7UGsOA?e=9bBX4S", departamento: "Clinical Policy" },
  { id: 97, nombre: "Alexa Speak2 Policy.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBcorH_s71_TJDa64cOxQCkAX3xnkvbkSBs8myy5oi22Q4?e=WBM2w9", departamento: "Clinical Policy" },
  { id: 98, nombre: "Approved Assitance Devices.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAlImmRLolSRob8pwuV-ql8AROaN-MiZdL2uiHcqSG_UCU?e=8GZvPu", departamento: "Clinical Policy" },
  { id: 100, nombre: "Common Area Video Surveillance.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDm-FEpDjfSQLpI-A_qIx6MAaCHkGAlu6dLZvf9DCFDboE?e=OLsm6C", departamento: "Clinical Policy" },
  // A
  { id: 101, nombre: "Abuse and Neglect Policy.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/EfkgfWdgv6REnYpg4OuSqCgBwACo8c3DFKRuFsIgOofjTQ?e=4xlCjv", departamento: "Clinical Policy" },
  { id: 102, nombre: "Active Shooter Policy.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBmPsVUHDKwRJHU5iTbzbxhAQb1bXBJOhgARaz5mURWeKY?e=7iKTmi", departamento: "Clinical Policy" },
  { id: 103, nombre: "Academy Assesment Flyer.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2024/08/Atlas_Academy_Intro_Flyer.pdf", departamento: "" },
  { id: 104, nombre: "A-Team Referral Flyer.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2025/04/The-A-Team-Referral-Flyer.pdf", departamento: "" },
  { id: 105, nombre: "Academy Component.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2024/08/Atlas-Academy-Component-Flyer.pdf", departamento: "" },
  { id: 106, nombre: "Academy Intro Flyer.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2024/08/Atlas_Academy_Intro_Flyer.pdf", departamento: "" },
  { id: 107, nombre: "Academy, Lifestyle & SPIRIT Training.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/a8uxK5-Academy-Lifestyles-Spirit-Training.pdf", departamento: "" },
  { id: 108, nombre: "Activities of Daily Living.docx", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/ADL-Policy.docx", departamento: "Clinical Policy" },
  { id: 109, nombre: "Achieving Better Outcomes.xlsx", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Achieving-Better-Outcomes-24-homebase-checklist.xlsx", departamento: "Clinical Policy" },
  { id: 110, nombre: "Activities Policy and Procedure.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/EXz5bVyNSldPsn3v9fOs5KYBx59VoXYpCYr8yEX2iLIZfQ?e=7brdIF", departamento: "Clinical Policy" },
  { id: 111, nombre: "ADL-Policy.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQD-p9Y3JLcET5IledwYI2JwAfydbuHp_ilghHwUXDFywKw?e=uBOy7t", departamento: "Clinical Policy" },
  { id: 112, nombre: "Admission Criteria FL.docx", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Admission-Criteria-FLORIDA-Policy.docx", departamento: "Clinical Policy" },
  { id: 113, nombre: "Admission Discharge AL.docx", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Admission-Discharge-Policy-Alabama-SCALF.docx", departamento: "Clinical Policy" },
  { id: 114, nombre: "Adverse Drug Reaction.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAnCPmYCtYkS5s1eOkzbdzLAQnT2rqjF_riLoWFxMXwJsE?e=13pPsx", departamento: "Clinical Policy" },
  { id: 115, nombre: "Against Medical Advice.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2026/01/Against-Medical-Advice-1.pdf", departamento: "" },
  { id: 116, nombre: "Aggression.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQD7YmzlJcmKSLsDLFbUTBUuAaLTWJVH8fbHpqhEoH_EZWA?e=JX3p0H", departamento: "Clinical Policy" },
  { id: 117, nombre: "Alabama Assesment.docx", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/alabama-assessment-policy.docx", departamento: "Clinical Policy" },
  { id: 118, nombre: "ALMC refrigerator microwaves.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBd4GvXZ7afRYJZHuFIJriWAVgZaDduvLRbq2x1XkYfdHI?e=dxfNeg", departamento: "Clinical Policy" },
  { id: 119, nombre: "AL Coordinator.docx", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Assisted-Living-Coordinator.docx", departamento: "Job Description" },
  { id: 120, nombre: "Alternative Pharmacy.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBU99f18CwGRYP6_n4eZf96ATUJISYTCHfVEEi7cZS5xcY?e=HbcNRk", departamento: "Clinical Policy" },
  { id: 121, nombre: "Alzheimer's Special Care.docx", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/SC-Alzheimers-policy.docx", departamento: "Clinical Policy" },
  { id: 122, nombre: "Anti-Harassment Policy.docx", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/Atlas-Anti-Harassment-Policy.docx", departamento: "" },
  { id: 123, nombre: "Annual Associate Self Review.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2023/11/Associate_Self_Review_Editable_Form.pdf", departamento: "" },
  { id: 124, nombre: "Annual Manager Review.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2023/11/Manager_Review_Editable_Form.pdf", departamento: "" },
  { id: 125, nombre: "Apartment Checklist.pdf", letra: "A", link: "https://www.atlasseniorliving.net/wp-content/uploads/2022/03/Atlas_Apartment_Checklist_Hi_Res_1.pdf", departamento: "" },
  { id: 126, nombre: "Assistive Devices Policy.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQD2rvYzsuEXQJaGaKQ4ssu9AfPZYgMtBpOHfvckmEznjmg?e=uUfpAy", departamento: "Clinical Policy" },
  { id: 127, nombre: "Assisted Living Admission Order.docx", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2025/07/Assisted-Living-Admission-Order-Form.docx", departamento: "Clinical Policy" },
  { id: 128, nombre: "Associate Break Policy.docx", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/Associate-Break-Policy-Acknowledgement.docx", departamento: "" },
  { id: 129, nombre: "Associate Injury Form.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/Atlas_Associate_Injury_Form.pdf", departamento: "" },
  { id: 130, nombre: "Associate Self Review.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2025/02/Atlas_Associate_Self_Review_Editable_Form.pdf", departamento: "" },
  { id: 131, nombre: "Associate Survey.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/Atlas-Associate-Survey-2022.pdf", departamento: "" },
  { id: 132, nombre: "Assumed Risk Covid No Mask.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Assumed-Risk-Covid-No-Mask.pdf", departamento: "" },
  { id: 133, nombre: "Assumed Risk Agreement.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Assumed-Risk-Agreement-Form_For-Fill.pdf", departamento: "" },
  { id: 134, nombre: "Atlas Application.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Atlas-Application.pdf", departamento: "" },
  { id: 135, nombre: "Atlas Handbook 2025.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2025/07/Atlas-Handbook-2025.pdf", departamento: "" },
  { id: 136, nombre: "Attendance Policy.docx", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/Atlas-Attendance-Policy.docx", departamento: "" },
  { id: 137, nombre: "Atlas Speak 2 Codes.pdf", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/personal/mrost_atlasseniorliving_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments%2F%5FAtlas%20Speak2%20codes%20%28leaving%20apartment%20%29%2Epdf&parent=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments&ct=1779992946917&or=OWA%2DNT%2DMail&cid=be5150a6%2Df654%2D533f%2Dcfe2%2D6e672a012626&ga=1", departamento: "" },
  { id: 138, nombre: "Attempt to Collect Letter.docx", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/Attempt-to-Collect-Letter.docx", departamento: "" },
  { id: 139, nombre: "Automobile Accident Claim Report.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2025/02/Automobile-Accident-Claim-Report-Form-02132025.pdf", departamento: "" },
  // B
  { id: 140, nombre: "Barber & Beauticians Preferences.docx", letra: "B", link: "https://atlasseniorliving.net/wp-content/uploads/2025/04/Barber-Beauticians-Preferences-Sheet.docx", departamento: "" },
  { id: 141, nombre: "Bartender.docx", letra: "B", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Bartender.docx", departamento: "Job Description" },
  { id: 142, nombre: "Bed Bug.docx", letra: "B", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAsSzb-PWLGRIU8Q8aFb33KAQtakoPZtfb0-UkRR0J23W0?e=HJk5rr", departamento: "Clinical Policy" },
  { id: 143, nombre: "Bed Rails Assisted Devices.docx", letra: "B", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDRuaKk6AQGRKlB4uUaOaGqAXKrE7gXemLj8YQ3WRbfMzo?e=pOKggl", departamento: "Clinical Policy" },
  { id: 144, nombre: "Blood Glucose Monitoring.docx", letra: "B", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBmuBk-QEqBQ6BQspmTdm-KATGHFLI1JhROEVG3E9IQSTk?e=lwFg13", departamento: "Clinical Policy" },
  { id: 145, nombre: "Bloodborne Pathogens Exposure.docx", letra: "B", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAkOkTfQuD8Tq2VwsLz7kUUATWpHfiLh9wGw1kyZW-Strg?e=Dn5RzY", departamento: "Clinical Policy" },
  { id: 146, nombre: "Business Office Coordinator.docx", letra: "B", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Business-Office-Coordinator.docx", departamento: "Job Description" },
  { id: 147, nombre: "Blood Spills.docx", letra: "B", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Cleaning-Spills-of-Blood-and-Bodily-Fluids-Policy.docx", departamento: "" },
  { id: 148, nombre: "Business Services Standards.xlsx", letra: "B", link: "https://atlasseniorliving.net/wp-content/uploads/2024/04/Atlas-Business-Services-Standards.xlsx", departamento: "" },
  // C
  { id: 149, nombre: "Call Light.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQABgEFnaVR3QKkS6rwdesQVAQpFbefI3EedTuHocTR7RMI?e=SBgs3c", departamento: "Clinical Policy" },
  { id: 150, nombre: "Call Out Policy.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDKYqY6hbtYSZv4HmjNqXy-Ac3WY3TjlxiCf2d-cHk_sbQ?e=HiCFhy", departamento: "" },
  { id: 151, nombre: "Care Associate.docx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Care-Associate.docx", departamento: "Job Description" },
  { id: 152, nombre: "Care Plan.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCmeHJj664wRYDnpjr2u0N_AUB1yPuG_UGPJ3fouv31Yms?e=uvk5IE", departamento: "Clinical Policy" },
  { id: 153, nombre: "Care Plan Review.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDwX6pAV4mPSI6wqGk4oLbiATwvnNaN5wn1UCKGAjZmNqA?CID=0797fe9d-2e27-8ebe-250b-2eaf7d20c22a", departamento: "Clinical Policy" },
  { id: 154, nombre: "Certified Medication Assistant.docx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Certified-Medication-Assistant.docx", departamento: "Job Description" },
  { id: 155, nombre: "CEO Letter.pdf", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/CEO-Letter.pdf", departamento: "" },
  { id: 156, nombre: "Change in Health Status.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQC1s10ai1OGTaSdPJYeIv0PAfdbxayllBp4-jIJHZELYz4?e=xV4Uxx", departamento: "Clinical Policy" },
  { id: 157, nombre: "Change of Condition.pdf", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Change-of-Condition-Policy.pdf", departamento: "Clinical Policy" },
  { id: 158, nombre: "Chemical Safety.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQD2865g-ZHESbeIU4Vl2ilKAatFIoVPopwHFPE_TD1a8ms?e=TeP5Df", departamento: "Clinical Policy" },
  { id: 159, nombre: "Circle of Excellence.docx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2023/03/circle-of-excellence-criteria.docx", departamento: "Clinical Policy" },
  { id: 160, nombre: "Clinical Standards.xlsx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:x:/p/mrost/ETMUjiepEy1Fuv7DN73Vs9oBJfROlBVjbRHq90aoipvNLw?e=XAUVUW", departamento: "" },
  { id: 161, nombre: "CMA Request.link", letra: "C", link: "https://atlasseniorliving.net/forms-graphics/cma-new-user/", departamento: "Redirect Link" },
  { id: 162, nombre: "Cognitive Evaluation.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDk3XAEWZEGSZb5OgoBotLRAYNX09sfXRz-bWCGc4A2tpM?e=H3R3h7", departamento: "Clinical Policy" },
  { id: 163, nombre: "Comission Template.xlsx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2025/07/Sales-250-Commission-Template-2025.xlsx", departamento: "" },
  { id: 164, nombre: "Community Events Sales Checklist.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDQ2e1_9UgsS5mtRhVpq0J9AbuTuTB-l_7xyNaEIfb3GIc?e=1ezLH8", departamento: "" },
  { id: 165, nombre: "Community Support Questions.pdf", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2025/07/Community-Support-Questions.pdf", departamento: "" },
  { id: 166, nombre: "Community Temperature.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDFZL78R6QgR7Nln9llkeyHAT4r6pO-mabXFhFmGm9Anu8?e=UGGrsy", departamento: "Clinical Policy" },
  { id: 167, nombre: "Company Property Acknowledgement.pdf", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2025/06/Atlas-Company-Property-Acknowledgement.pdf", departamento: "" },
  { id: 168, nombre: "Computer Request.docx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Computer-Request-Form.docx", departamento: "" },
  { id: 169, nombre: "Competitive Analysis.xlsx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2023/01/Competitive-Analysis-2022.xlsx", departamento: "" },
  { id: 170, nombre: "Concierge.docx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Concierge.docx", departamento: "Job Description" },
  { id: 171, nombre: "Confidentiality.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCyj4O8u6aPSL1phQXEYiv8AX5jhT_0T8M6j4e2F_dvgFs?e=0sa6IN", departamento: "Clinical Policy" },
  { id: 172, nombre: "Cook.docx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Cook.docx", departamento: "Job Description" },
  { id: 173, nombre: "Conducting Workplace Investigations.pdf", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/conducting_workplace_investigations_checklist.pdf", departamento: "" },
  { id: 174, nombre: "Controlled Drugs Management.docx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2024/11/Controlled-Drugs-Management-Policy.docx", departamento: "Clinical Policy" },
  { id: 175, nombre: "Controlled Substances.docx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Controlled-Substance-Accounting-Policy-16232022.docx", departamento: "Clinical Policy" },
  { id: 176, nombre: "Controlled Substance Acctng.docx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Controlled-Substance-Accounting-Policy-16232022.docx", departamento: "Clinical Policy" },
  { id: 177, nombre: "Controlled Drug Shift.pdf", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCjA0crsQutR6iPmfYuSy08Ae_-sb0XMoHSEqO86tKId0c?e=eCCU3L", departamento: "" },
  { id: 178, nombre: "Cooks Weekly Cleaning.pdf", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Cooks-Weekly.pdf", departamento: "" },
  { id: 179, nombre: "Coronaviurs Outbreak.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAbWm0RT7ahQ5Dv-imrdi0CAdhiIrVzAe6KSGn7eCS_R8A?e=RhjdZH", departamento: "Clinical Policy" },
  { id: 180, nombre: "Corrective Action.docx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Corrective-Action-Form.docx", departamento: "Clinical Policy" },
  { id: 181, nombre: "Covid Policy.docx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Covid-policy-03042025.docx", departamento: "Clinical Policy" },
  { id: 182, nombre: "COVID-19 Positive.docx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Covid-policy-03042025.docx", departamento: "Clinical Policy" },
  { id: 183, nombre: "COVID-19 Screening Log.pdf", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Covid-Screening-Log.pdf", departamento: "" },
  { id: 184, nombre: "CPR Policy.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBGWmiGvdzCRZXVVellasoiAcE2QkVRGjjXbJRKllm2Imw?e=x6SGsD", departamento: "Clinical Policy" },
  { id: 185, nombre: "Creative & Social Media Standards.xlsx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2024/04/Atlas-Creative-and-Social-Media-Standards.xlsx", departamento: "" },
  { id: 186, nombre: "Credit & Debit Card Authorization.pdf", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2025/04/Credit-Debit-Card-Authorization-Form.pdf", departamento: "" },
  { id: 494, nombre: "Core Activities 5.pdf", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2024/08/Atlas_Academy_5-Core-Activities.pdf", departamento: "" },

  // D
  { id: 187, nombre: "Daily FOH.xlsx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Daily-FOH.xlsx", departamento: "" },
  { id: 188, nombre: "Daily HOH.xlsx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Daily-HOH.xlsx", departamento: "" },
  { id: 189, nombre: "Daily SMD Form.pdf", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2023/07/daily-smd-form.pdf", departamento: "" },
  { id: 190, nombre: "Department Spenddown.xls", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2022/07/Atlas_Department-Spenddowns.xls", departamento: "" },
  { id: 191, nombre: "Death of a Resident.docx", letra: "D", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQA1aH-pC6tgTa_VyMKLsg6WAXrVedN6KrYl7FxV3PKZ0vs?e=Xu1CGx", departamento: "Clinical Policy" },
  { id: 192, nombre: "Deep Clean Back.xlsx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/deep-clean-back.xlsx", departamento: "" },
  { id: 193, nombre: "Deep Clean Front.xlsx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Deep-clean-front.xlsx", departamento: "" },
  { id: 194, nombre: "Denial Process Admissions.docx", letra: "D", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQD2j5xbejuiS6NWDPJfj1F4Aa37z7IaumypjHqe_LgamMQ?CID=b43aa5af-6aeb-7c62-f4d2-325d6b3acaba", departamento: "Clinical Policy" },
  { id: 195, nombre: "Deposit - Community Fee Receipt.pdf", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2024/01/Atlas-Deposit-Community-Fee-Receipt.pdf", departamento: "" },
  { id: 196, nombre: "Destruction Discontinued Meds.pdf", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2026/01/Destruction-of-Discontinued-Medications.pdf", departamento: "" },
  { id: 197, nombre: "Destruction & Disp Meds.docx", letra: "D", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBfkILDb2XeTaDif7D7WssjAdzRvAZcVcI2BWnHyIMOr_8?e=VQ63LX", departamento: "Clinical Policy" },
  { id: 198, nombre: "Detailed Inquiry Sheet.docx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2025/01/Detailed-Inquiry-Sheet.docx", departamento: "" },
  { id: 199, nombre: "Diet Notifications Food Preferences.docx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2025/04/Diet-Notifications-Food-Preferences.docx", departamento: "" },
  { id: 200, nombre: "Diet Order.docx", letra: "D", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCLD8NGOPyXQZ790i20p7VaATOtuaAEiyP3F9pGXbdY9ME?e=evY9oo", departamento: "Clinical Policy" },
  { id: 201, nombre: "Dinning Service Coordinator.docx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Dining-Service-Coordinator.docx", departamento: "Job Description" },
  { id: 202, nombre: "Dinning Service Director.docx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Dining-Services-Director.docx", departamento: "Job Description" },
  { id: 203, nombre: "Director of Building Services.docx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2024/12/Director-of-Building-Services.docx", departamento: "Job Description" },
  { id: 204, nombre: "Dining Services Standards.xlsx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2024/04/Atlas-Dining-Services-Standards.xlsx", departamento: "" },
  { id: 205, nombre: "Discharge & Refund.docx", letra: "D", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDcZb_pVvxwSajy9sRjQKn5Aa8WPbcLMcZekcrvOL1mfDE?e=JyLUZb", departamento: "Clinical Policy" },
  { id: 206, nombre: "Dish Temperature Log.xlsx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Dish-temperature-log.xlsx", departamento: "" },
  { id: 207, nombre: "Dish Utility Cleaning.xlsx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Dish-utility-cleaning.xlsx", departamento: "" },
  { id: 208, nombre: "Dishwasher & Utility.docx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Dishwasher-Utility.docx", departamento: "Job Description" },
  { id: 209, nombre: "Dishwasher Job Description.docx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2025/08/Dish-Washer-Job-Description.docx", departamento: "" },
  { id: 210, nombre: "Driver Job Description.docx", letra: "D", link: "https://atlasseniorliving.net/wp-content/uploads/2025/08/Driver-Job-Description.docx", departamento: "" },
  // E
  { id: 211, nombre: "ECC LNS Review.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQB87Ux2NA74RpnHyMC4x3yyAQOst8jdq1ibPCaculNPv30?e=QuKD0P", departamento: "" },
  { id: 212, nombre: "ECC Policy and Procedure.docx", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2024/12/ECC-Policy-and-Procedure-07122022.docx", departamento: "Clinical Policy" },
  { id: 213, nombre: "ECC Spreadsheet.pdf", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/ECC-Spreadsheet.pdf", departamento: "" },
  { id: 214, nombre: "ED & Sales Weekly Meeting.pdf", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/ED-Sales-Weekly-Meeting.pdf", departamento: "" },
  { id: 215, nombre: "EFT Authorization.pdf", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2025/04/EFT-Authorization-Form.pdf", departamento: "" },
  { id: 216, nombre: "Electronic Medical Records.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBzADagfDE5Q4R1xkGL0h_5AaLklZ9X_Ptxfn0W0ve5Bss?e=QCdxLg", departamento: "Clinical Policy" },
  { id: 217, nombre: "Electronic Monitoring Sign Resident Door.pdf", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:b:/p/fpatino/IQD3dIHKIULtT6DX-Yxkd1PLARvOPcrMZglMoZ-CQ_X82i8?e=OFdnga", departamento: "" },
  { id: 218, nombre: "Electronic Recording Device.pdf", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Electronic-Recording-Device-Acknowledgement.pdf", departamento: "" },
  { id: 219, nombre: "Elopement Emergency.pdf", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/16-Elopement-emergency-form-1.pdf", departamento: "" },
  { id: 220, nombre: "Elopement Risk Assesment.docx", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2022/07/Atlas_Elopement_Risk_Assessment_Form.docx", departamento: "" },
  { id: 221, nombre: "Elopement Drill Policy.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBWBz4VUUHqSayLwja3_jyuAUGxlBMYqw5dLhil4MtBMzU?e=xsnbTX", departamento: "Clinical Policy" },
  { id: 222, nombre: "Elopement/Missing Resident.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBBQMcSPvt4Q5mQnnwONrPDAYqzCLJCMf7cD3ipMVuD_ok?e=ef10h4", departamento: "Clinical Policy" },
  { id: 223, nombre: "eMAR Conversion.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQD-rWVKfavFTrkMHJ_bNMPMAUuPCW30pDUYwMkY2no1p3s?e=qXOe6R", departamento: "Clinical Policy" },
  { id: 224, nombre: "Emergency Plan AL.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDNMdqw1FQvRa-D3sFenHRfAeWmON49aqPVpZcFSXq9fvM?e=cNS4xV", departamento: "Clinical Policy" },
  { id: 225, nombre: "Electric Wheelchair.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBfHAbD1Q38SKZOoDHYYPIzAe57vI2qP_wD6bm94uUSQL0?e=VWCRAj", departamento: "Clinical Policy" },
  { id: 226, nombre: "Emergency Contact Info.pdf", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Community-Emergency-Contact-Information.pdf", departamento: "" },
  { id: 227, nombre: "Emergency Menu.docx", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/EMERGENCY-MENU.docx", departamento: "" },
  { id: 228, nombre: "Employee Assistance.pdf", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2022/07/Atlas_EAP-Employee_Flyer.pdf", departamento: "" },
  { id: 229, nombre: "Employee Benefit Guide.pdf", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/24-25AtlasBenefitsGuide-1.pdf", departamento: "" },
  { id: 230, nombre: "Employee Probatory Period.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAmC4WTJPe1Qrs8H3imb03cAXfByjTf3pAE_J-u2ZWpwhA?e=D5djhX", departamento: "" },
  { id: 231, nombre: "Employee Request Off.docx", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Employee-request-off.docx", departamento: "" },
  { id: 232, nombre: "Employment Application.pdf", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Employment-Application.pdf", departamento: "" },
  { id: 233, nombre: "Engage Bingo.xlsx", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2024/08/Engage-Bingo.xlsx", departamento: "" },
  { id: 234, nombre: "Environmental Safety Policy.docx", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2025/12/Environmental-Safety-Policy.docx", departamento: "" },
  { id: 235, nombre: "Environmental Surfaces.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBbp7hR6TB8SbweEKI4uuEkAdBo7e2j25FFb6Y7IRTCi84?CID=c2ad2601-fad0-f601-e4ee-558349d39cd9", departamento: "" },
  { id: 236, nombre: "Event Planner Checklist.pdf", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2024/06/Event-Planner-Checklist.pdf", departamento: "" },
  { id: 237, nombre: "Event Sales Checklist.docx", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2024/08/Community-Event-Sales-Checklist.docx", departamento: "" },
  { id: 238, nombre: "Everybody Wins.pdf", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/Atlas-Everyone_Wins-Flyer.pdf", departamento: "" },
  { id: 239, nombre: "Executive Chef.docx", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Executive-Chef.docx", departamento: "Job Description" },
  { id: 240, nombre: "Executive Director.docx", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Executive-Director.docx", departamento: "Job Description" },
  { id: 241, nombre: "Exit Interview.docx", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2024/06/EXIT-INTERVIEW.docx", departamento: "" },
  // F
  { id: 242, nombre: "Face of House Cleaning.xlsx", letra: "F", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Face-of-house-cleaning.xlsx", departamento: "" },
  { id: 243, nombre: "Fall Policy & Procedure.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAkU1MdwCw8Rr_n64YY_KV5AdNBiDK8CqoQuteQ-olcZwA?e=cIjNJl", departamento: "Clinical Policy" },
  { id: 244, nombre: "Fall Risk Assessment.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCAYYg3RKsPTbgeb_DvuR65ATEy1qZ6YpHvH6I87UTmiRc?e=wBtc7W", departamento: "Clinical Policy" },
  { id: 245, nombre: "Family & Move-In Form.pdf", letra: "F", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/Atlas-Family_and_Move-in_Forms.pdf", departamento: "" },
  { id: 246, nombre: "Famous Duos Flyer.pdf", letra: "F", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Atlas_Spirit-Famous-Duos_Flyer-.pdf", departamento: "" },
  { id: 247, nombre: "Fax Physician Form.pdf", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/personal/mrost_atlasseniorliving_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments%2FFax%20Physician%20Form%2Epdf&parent=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments&ct=1780002893358&or=OWA%2DNT%2DMail&cid=6e19be5d%2D1f25%2Dc136%2Dfec1%2D9dea2f327a80&ga=1", departamento: "" },
  { id: 248, nombre: "Fit Test Checklist.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBNCUaYxT5kT5ocHGRISGUVAUre5sZjxrMLAu8Dz5VWOD4?CID=3efc2a77-775a-25ae-efd4-b85b3c393e86", departamento: "" },
  { id: 249, nombre: "Fire Watch Log.docx", letra: "F", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Fire-Watch-Log.docx", departamento: "" },
  { id: 250, nombre: "Final PCC Binder.pdf", letra: "F", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Final-Final-PCC-binder-4.pdf", departamento: "Clinical Policy" },
  { id: 251, nombre: "Fingernail Policy.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQD3Xn1pw_1YR6DRJRlCrJ7OAePCKXD4KInJlMfdezov0qQ?CID=9774fbf5-6ee0-c6c6-2488-331c173cae4b", departamento: "Clinical Policy" },
  { id: 252, nombre: "Fire Drill Policy.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCkKQJsKO2LRLPzBwo_vSeYAQLNeJ8ZcxUtzBB0fq0sAmo?e=4auaKI", departamento: "Clinical Policy" },
  { id: 253, nombre: "First Aid.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBfvufF36ihQKCzo39a5bS0AUibAy3xmYHJ45RocgbCvYs?e=prtz5Q", departamento: "Clinical Policy" },
  { id: 254, nombre: "Fit Test Policy & Procedure.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDoAQ7EIT98RYqT2n7POz7bAUJx5Ctp6XlEc0I4ZLM8cNQ?e=HeRAcv", departamento: "Clinical Policy" },
  { id: 255, nombre: "Flu Policy And Procedure.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQB5vp8cH5NISbPwnPUyZG2YAaibliMNBOMaUuJr8KoH5fY?e=FTGixL", departamento: "Clinical Policy" },
  { id: 256, nombre: "Food Labeling Policy.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBeuhABh-B3TbqZwp4E4vc_AWkmX3_iEW-D9QYZWg_SLGU?e=khYSSD", departamento: "Clinical Policy" },
  { id: 257, nombre: "Food & Mealtime Preferences.pdf", letra: "F", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Food-and-Mealtime-Preferences-Form.pdf", departamento: "" },
  { id: 258, nombre: "FORCE Lifestyles Program.pdf", letra: "F", link: "https://atlasseniorliving.net/wp-content/uploads/2024/09/FORCE-Lifestyles-Program.pdf", departamento: "" },
  { id: 259, nombre: "Freezer 2 Temperature.xlsx", letra: "F", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Freezer-2-temperature.xlsx", departamento: "" },
  { id: 260, nombre: "Freezer 3 Temperature.xlsx", letra: "F", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Freezer-3-temperature.xlsx", departamento: "" },
  // G
  { id: 261, nombre: "Guidance for COVID-19 Positives.docx", letra: "G", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBV8stX8UyjQrWmSPhJTMwZAdYNCkNW7q3nZtZJtsmCUhw?e=9vlQys", departamento: "Clinical Policy" },
  { id: 262, nombre: "Generator PP.docx", letra: "G", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCg09gD765XR4uTDPCdDbT-AdcygjJFDDnPB0-NkFwtcFY?e=35jqfl", departamento: "Clinical Policy" },
  { id: 263, nombre: "Glucometer Log.pdf", letra: "G", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Glucometer-Log.pdf", departamento: "" },
  { id: 264, nombre: "Grievance Policy.docx", letra: "G", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDQLRCejcLMSrOOH_iEUIH0AYcGIivVgxaXu66Pce9sxoY?e=S7BtmP", departamento: "Clinical Policy" },
  // H
  { id: 265, nombre: "Handwashing.docx", letra: "H", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDhGJ9KXVAsSb8QFmN7jMuCAdja-3RsILhqjK8eXWjOXdo?e=fQmnDl", departamento: "Clinical Policy" },
  { id: 266, nombre: "Hashtags for Social Media.xlsx", letra: "H", link: "https://atlasseniorliving.net/wp-content/uploads/2025/01/Ideas-for-Social-Media-3.xlsx", departamento: "" },
  { id: 267, nombre: "Hazardous Materials.docx", letra: "H", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDB0ZFwWIURSJA6sK-npz8TAbUrZ_fzr1hHE-eHY0OTS1o?e=yvqSvx", departamento: "Clinical Policy" },
  { id: 268, nombre: "Head Injury.docx", letra: "H", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAPuXOaCpxsTpaxSv6d04sAAbEbsbDHFPviFluQ4kPoe9Y?e=Vo5GuL", departamento: "Clinical Policy" },
  { id: 269, nombre: "Head Lice Policy.docx", letra: "H", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDceWvYGMISRp8X8mwiRgPAAXwxuBJWrKuIGppMRXQ0j7I?e=ZpS7Pv", departamento: "Clinical Policy" },
  { id: 270, nombre: "Health Assesment Request.pdf", letra: "H", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/Atlas-Health_Assessment_Form.pdf", departamento: "" },
  { id: 271, nombre: "Height / Weight.docx", letra: "H", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCpat_t55HXTKDHAJcN9bOPAYRKJTHHOnJPTcPoPmpQSL8?e=bbiWrS", departamento: "Clinical Policy" },
  { id: 272, nombre: "HIPAA Disclosure.docx", letra: "H", link: "https://atlasseniorliving.net/wp-content/uploads/2024/12/HIPAA-Disclosure-Policy.docx", departamento: "Clinical Policy" },
  { id: 273, nombre: "Hot & Cold Holding Log.pdf", letra: "H", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/HeatingCoolingLog.pdf", departamento: "" },
  { id: 274, nombre: "Holiday Pay.docx", letra: "H", link: "https://atlasseniorliving.net/wp-content/uploads/2024/12/Holiday-Pay-Policy.docx", departamento: "Clinical Policy" },
  { id: 275, nombre: "HR Standards.xlsx", letra: "H", link: "https://atlasseniorliving.net/wp-content/uploads/2024/04/Atlas-HR-Standards.xlsx", departamento: "" },
  { id: 276, nombre: "Housekeeper.docx", letra: "H", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Housekeeper.docx", departamento: "Job Description" },
  { id: 277, nombre: "Housekeeping & Laundry.pdf", letra: "H", link: "https://atlasseniorliving-my.sharepoint.com/:b:/p/fpatino/IQBFfXRVK26pTJUd-_gRGj0XAT1hjL_m6ORnlwjAHHJMoPg?e=xaiA30", departamento: "Clinical Policy" },
  { id: 278, nombre: "Housekeeping Standards.xlsx", letra: "H", link: "https://atlasseniorliving.net/wp-content/uploads/2024/04/Atlas-Housekeeping-Standards.xlsx", departamento: "" },
  { id: 495, nombre: "24 Hour Report", letra: "H", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/24-Hour-Report-Policy.docx", departamento: "Clinical Policy" },


  // I
  { id: 279, nombre: "Ice Breaker Questions.docx", letra: "I", link: "https://atlasseniorliving.net/wp-content/uploads/2025/05/Ice-Breaker-Questions22.docx", departamento: "" },
  { id: 280, nombre: "Ice Cream Freezer.xlsx", letra: "I", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Ice-cream-freezer.xlsx", departamento: "" },
  { id: 281, nombre: "Ice Machine Cleaning.xlsx", letra: "I", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Ice-machine-cleaning.xlsx", departamento: "" },
  { id: 282, nombre: "Ice Machine Log.docx", letra: "I", link: "https://atlasseniorliving.net/wp-content/uploads/2022/08/Ice-Machine-Log-Form-.docx", departamento: "" },
  { id: 283, nombre: "Ignite 3 Day Schedule.docx", letra: "I", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/Ignite-3-Day-Schedule.docx", departamento: "" },
  { id: 284, nombre: "Ignite Orientation.pptx", letra: "I", link: "https://atlasseniorliving.net/wp-content/uploads/2025/09/Atlas-Ignite-Orientation.pptx", departamento: "" },
  { id: 285, nombre: "Ignite Scavenger Hunt.docx", letra: "I", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/Ignite-Scavenger-Hunt.docx", departamento: "" },
  { id: 286, nombre: "Ignite Table of Contents.docx", letra: "I", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/Ignite-Table-of-Contents.docx", departamento: "" },
  { id: 287, nombre: "Ignite Training.docx", letra: "I", link: "https://atlasseniorliving.net/wp-content/uploads/2025/05/Ignite-Training92.docx", departamento: "" },
  { id: 288, nombre: "Internal Site Access Request.link", letra: "I", link: "https://atlasseniorliving.net/forms-graphics/internal-site-request-form/", departamento: "Redirect Link" },
  { id: 289, nombre: "Incident Reporting.docx", letra: "I", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBnD6mxyGteQrLnjDrHZRTGAf9KbLzPVOyznfhYPPnpQyE?e=cMWGmG", departamento: "Clinical Policy" },
  { id: 290, nombre: "Inclement Weather Policy.docx", letra: "I", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQClWo0M_8LuSJYMfG1JU7lpAdE8HnOCGrhx7nAI1dzPEHE?e=rEErf3", departamento: "Clinical Policy" },
  { id: 291, nombre: "Incorrect Order Incomplete.docx", letra: "I", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Incorrect-order-incomplete-order-policy.docx", departamento: "Clinical Policy" },
  { id: 292, nombre: "Influenza.docx", letra: "I", link: "https://atlasseniorliving.net/wp-content/uploads/2024/11/Influenza-Policy.docx", departamento: "Clinical Policy" },
  { id: 293, nombre: "Insulin Administration.docx", letra: "I", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAUT5NWnKn0TJWR6FPHNgSoATvwAWpbL5hQPB-SEHquosA?e=eZ5ume", departamento: "Clinical Policy" },
  { id: 294, nombre: "In-Service Record.pdf", letra: "I", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/All-Staff-Sign-In-Sheet.pdf", departamento: "" },
  { id: 295, nombre: "Individualized Activities.pdf", letra: "I", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Atlas_Spirit-Indivdualized-Activities_Flyer-.pdf", departamento: "" },
  // J
  { id: 296, nombre: "Jobs & Designs Request.link", letra: "J", link: "https://atlasseniorliving.net/forms-graphics/request-new-projects/job-request-form/", departamento: "Redirect Link" },
  // K
  { id: 297, nombre: "Kitchen Self Inspection.pdf", letra: "K", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Self-Inspection.pdf", departamento: "" },
  { id: 298, nombre: "Refrigerator Log Kitchen.xlsx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Beverage-fridge.xlsx", departamento: "" },
  // L
  { id: 299, nombre: "Late Payment Checklist.docx", letra: "L", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/New-Late-Payment-Checklist.docx", departamento: "" },
  { id: 300, nombre: "Laundry Policy.pdf", letra: "L", link: "https://atlasseniorliving-my.sharepoint.com/:b:/p/grosales/IQC_ZFc1AjMFTr6Jc_W-ysetASqM1T1JPU1zlvWcg9JPohA?e=GeWS58", departamento: "Clinical Policy" },
  { id: 301, nombre: "Lead Care Associate.docx", letra: "L", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Lead-Care-Associate.docx", departamento: "Job Description" },
  { id: 302, nombre: "Lead Certified Medication Asstnt.docx", letra: "L", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Lead-Certified-Medication-Asistant.docx", departamento: "Job Description" },
  { id: 303, nombre: "Lead Housekeeper.docx", letra: "L", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Lead-Housekeeper.docx", departamento: "Job Description" },
  { id: 304, nombre: "Licensed Practical Nurse.docx", letra: "L", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Licensed-Practical-Nurse-LPN.docx", departamento: "Job Description" },
  { id: 305, nombre: "Lifestyle Assistant.docx", letra: "L", link: "https://atlasseniorliving.net/wp-content/uploads/2026/01/Lifestyles-Assistant-Job-Description.docx", departamento: "Job Description" },
  { id: 306, nombre: "Lifestyle Coordinator.docx", letra: "L", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Lifestyle-Coordinator.docx", departamento: "Job Description" },
  { id: 307, nombre: "Lifestyle Director.docx", letra: "L", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Lifestyle-Director.docx", departamento: "Job Description" },
  { id: 308, nombre: "Lifestyles Force.pdf", letra: "L", link: "https://atlasseniorliving.net/wp-content/uploads/2024/09/Lifestyles-Force.pdf", departamento: "" },
  { id: 309, nombre: "Lifestyle Resident Information Profile.docx", letra: "L", link: "https://atlasseniorliving.net/wp-content/uploads/2025/08/Resident-information-Profile.docx", departamento: "" },
  { id: 310, nombre: "Lifestyles Standards.xlsx", letra: "L", link: "https://atlasseniorliving.net/wp-content/uploads/2024/08/Lifestyles-Standards-2024.xlsx", departamento: "" },
  { id: 311, nombre: "Lift Assist Policy.docx", letra: "L", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDjazHYLpHbSqgmRrxhHkvnAYmA-ho6L3toUxpzborgtu8?e=yUwh3c", departamento: "Clinical Policy" },
  { id: 312, nombre: "Limited Nursing Services.pdf", letra: "L", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Limited-Nursing-Services-Policy.docx-07122022.pdf", departamento: "Clinical Policy" },
  { id: 313, nombre: "Living with Dignity.docx", letra: "L", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Living-with-Dignity-Atlas-Incontinence-Program.docx", departamento: "Clinical Policy" },
  //M
  { id: 314, nombre: "Maintenance Asstnt/Techcn.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Maintenance-Assistant-or-Technician.docx", departamento: "Job Description" },
  { id: 315, nombre: "Maintenance Director.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Maintenance-Director.docx", departamento: "Job Description" },
  { id: 316, nombre: "Maintenance Onboarding.pdf", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/Atlas-Maintenance_form.pdf", departamento: "" },
  { id: 317, nombre: "Maintenance Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBv9hR4oX4lQb5AuaomC32-Ab0avMZ7TQTq47g8gyqo0ug?CID=722da69b-9bf5-bea5-bcf8-0f635fafba41", departamento: "" },
  { id: 318, nombre: "Maintenance Standards.xlsx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2024/04/Atlas-Maintenance-Standards.xlsx", departamento: "" },
  { id: 319, nombre: "Manager Daily Checklist.xlsx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Manager-Daily-checklist.xlsx", departamento: "" },
  { id: 320, nombre: "Manager on Duty.pdf", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/MOD-Checklist.pdf", departamento: "" },
  { id: 321, nombre: "Manager Self Review.pdf", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/02/Manager-Self-Review.pdf", departamento: "" },
  { id: 322, nombre: "Management Designee.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDD8wkD0SfVT4R6PAuX-G5RAdRzawrPKmDgWC4RT6WNjYg?e=Oivlbv", departamento: "Clinical Policy" },
  { id: 323, nombre: "MAR Audits.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQA0Rg0at_DJRboy-uQithVjAZy-BDkM98AGXohuAOkF9Nk?e=h9TDPg", departamento: "Clinical Policy" },
  { id: 324, nombre: "Master Cleaning Temperature.xlsx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2022/08/Master-cleaning_temperature-checklist-lock-version-.xlsx", departamento: "" },
  { id: 325, nombre: "MC Admission and Retention.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Memory-Care-Admission-and-Retention-Policy-2.docx", departamento: "Clinical Policy" },
  { id: 326, nombre: "Medication Aide.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Certified-Medication-Assistant.docx", departamento: "Job Description" },
  { id: 327, nombre: "Med Pass Competency Checklist.pdf", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:b:/p/grosales/IQC5WVsDJUvDQaUw3Q7bI0TpAUASIsqS3Tx7v0z599U-TSw?e=FlEE8E", departamento: "" },
  { id: 328, nombre: "Medication Destruction and Reload.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDXZBMO0m5vTLUqKcfeuxOMAYUIvcv-bO2iIQj9Cmx3qW8?e=zoDRGz", departamento: "Clinical Policy" },
  { id: 329, nombre: "Med Packaging & Labeling.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAXoduihlqHRaRIzV0_YmLkAUi_k_gXDY1sYijIjwyIDx0?e=ZZmVhL", departamento: "Clinical Policy" },
  { id: 330, nombre: "Medical Declination.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Medical-Declination-Form.docx", departamento: "Clinical Policy" },
  { id: 331, nombre: "Medical Marijuana Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBvsXAkDshiT5lUV8EP6A0RAd5ekH9PRA5sqrdPIo2sPM0?CID=6d9367d2-5649-569d-78c7-a9063a5a640f", departamento: "Clinical Policy" },
  { id: 332, nombre: "Medication Administration.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBQ-9OtZOOQS5ZFglEZE1fSAQrGnLfo8ULQd5Qi13iiwjg?e=7dwYk7", departamento: "Clinical Policy" },
  { id: 333, nombre: "Medication Disposal.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:b:/p/grosales/IQApS7pB9s4jRr2djGHEjLAPAf23NAlA_dm4UaBA1HzS_U0?e=HDWSUC", departamento: "Clinical Policy" },
  { id: 334, nombre: "Medication Documentation.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQC_pXZwvwHuTodZngYvxuf3AbRgqmD8674mnpiVYOgJKoo?e=EPb4En", departamento: "Clinical Policy" },
  { id: 335, nombre: "Medication Error.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBfgUGCR6reSbKAvB_hUj5YAZQ_lHNUt19NBjlFTe9cHvc?e=PkEc8n", departamento: "Clinical Policy" },
  { id: 336, nombre: "Medication Order Confirmation.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCpMdHvoa8fTrEggBG9rxGtAc7U8qP6ppQzzEvXrDS71A8?e=Qe81BH", departamento: "Clinical Policy" },
  { id: 337, nombre: "Medication Packaging.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Medication-Packaging-Policy.docx", departamento: "Clinical Policy" },
  { id: 338, nombre: "Medication Refusals Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDoZmFITnWLR7_M72huk3aRAfUZg-SqHiVA3OKLwqjihz8?CID=115f8124-e197-b7c3-ae70-07d8eca4b196", departamento: "Clinical Policy" },
  { id: 339, nombre: "Medication Release Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAtKc-M0Q1pSYgXfCJUI_7wAVEmyT4P8DXewxrHaDVSDps?CID=d95bbd93-eb70-40c0-6ae8-05f7f05fcceb", departamento: "Clinical Policy" },
  { id: 340, nombre: "Medication Reorder Hold.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCb8S-ZEXbGTqu3CetkbiSmAZK0KHUvHQC1EIqcqF7AwzQ?e=NzD3fl", departamento: "Clinical Policy" },
  { id: 341, nombre: "Medication Treatment Guidelines.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCHgIFKkI93Tb9sVoaReIfQASHJCvp5kOrIJ3Y_sSAzX5c?e=2c1YtP", departamento: "Clinical Policy" },
  { id: 342, nombre: "Medication Self-Administration Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCBlsB-OaODT53lFwzotC6cAdSWXSMytCt0ki4WUSgC52E?CID=485d5ac0-f9a0-1159-499b-f68412f24971", departamento: "Clinical Policy" },
  { id: 343, nombre: "Memory Care Admission and Retention Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCGSeL28q5GRomf0BsEH_meAUkhTnoxxxOSKxd-AHV6PeU?CID=863e3427-17de-6146-a4a7-0887c768c4ec", departamento: "Clinical Policy" },
  { id: 344, nombre: "Memory Care Director.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Memory-Care-Coordinator.docxj", departamento: "Job Description" },
  { id: 345, nombre: "Missed Time Punch.pdf", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Missing-Time-Punch-Form.pdf", departamento: "" },
  { id: 346, nombre: "Missing Resident.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAGTEJQdZWtRKerkYaaxrwNAYl13j-xu4xAnEr_Gt0XkCQ?e=fmP0qx", departamento: "Clinical Policy" },
  { id: 347, nombre: "Monthly Quality Assurance.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Quality-Assurance-Policy.docx", departamento: "" },
  { id: 348, nombre: "Monkeypox.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Monkeypox-Policy.docx", departamento: "Clinical Policy" },
  { id: 349, nombre: "Motorized Wheelchair.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Motorized-Wheelchair-Policy.docx", departamento: "Clinical Policy" },
  { id: 350, nombre: "Move In Coordinator.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Move-In-Coordinator.docx", departamento: "Job Description" },
  { id: 351, nombre: "Move In Rent Level of Care Form.pdf", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/11/Two-Page-Atlas-Level-of-Care-Move-In-Rent-Editable-6.pdf", departamento: "" },
  { id: 352, nombre: "Move In Satisfaction Checklist.xlsx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/04/Move-in-Process.xlsx", departamento: "" },
  // N
  { id: 353, nombre: "Narcotic Sheet.docx", letra: "N", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDHdKJyxwz-TKqTN_mXyJxbAWcCTaGYD4chYL_5suyMspQ?CID=5b78d689-245f-943e-28e7-bf6691d9be5f", departamento: "" },
  { id: 354, nombre: "New Hire Packet Final.docx", letra: "N", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/New-Hire-Packet-Final.docx", departamento: "" },
  { id: 355, nombre: "New Prospect Form.pdf", letra: "N", link: "https://atlasseniorliving.net/wp-content/uploads/2024/01/New-Prospect-Form.pdf", departamento: "" },
  { id: 356, nombre: "New Prospect Form.pdf", letra: "N", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/New-Residents-Notification.pdf", departamento: "" },
  { id: 357, nombre: "Negotiated Risk Agreement Policy.docx", letra: "N", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAdP0BRnUK5R4vZIfWjZrD-AcCHF0DTBFBPWBLW-q5fGWU?CID=ef3edb13-7ee1-5f0f-975a-1dd0d541c654", departamento: "Clinical Policy" },
  { id: 358, nombre: "Nurses Notes.docx", letra: "N", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Nurses-Notes-Policy-1.docx", departamento: "Clinical Policy" },
  // O
  { id: 359, nombre: "Offer Letter.docx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Atlas-Offer-letter.docx", departamento: "" },
  { id: 360, nombre: "Operations Standards 2025.xlsx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2025/08/Atlas-Standards-2025.xlsx", departamento: "" },
  { id: 361, nombre: "Open Close Daily.xlsx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Open-close-daily.xlsx", departamento: "" },
  { id: 362, nombre: "Orientation Certificate.docx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/Orientation-Certificate.docx", departamento: "" },
  { id: 363, nombre: "Ordering & Receipt of Medication.docx", letra: "O", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAjgwAik5mjTI2al3MJtcePAVUnXcvln-XIT_TCRJqiMOI?CID=88141d85-4793-3b7d-0257-0fc1b6128aa7", departamento: "Clinical Policy" },
  { id: 364, nombre: "Orientation New Wellness Director.docx", letra: "O", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQA4wrEapF7aRpPrmC5UE2fPAfeKXT90q1Jp7I3h5xQ5XVA?CID=e57b39b0-c187-13da-e5c6-5bd7e9b123c3", departamento: "" },
  { id: 365, nombre: "OSHA COVID-19.docx", letra: "O", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQC0wmC55MYpRJ4y-QR6N7pYAeJ421pEWd2Qb0SdiRrdVng?CID=0c0b876c-e0d7-5abf-28de-96b5520262f5", departamento: "Clinical Policy" },
  { id: 366, nombre: "Out of Service Signage.docx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Out-of-Service-Signage.docx", departamento: "" },
  { id: 367, nombre: "Oxygen Theraphy Safe.docx", letra: "O", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQACDZ1X-UnrSauJ6xL9qQzLAQIKnqDO0d1tK8hPGHIOTVM?CID=b4bd8a57-6445-cefc-3f94-46fc42bbc4f9", departamento: "Clinical Policy" },
  // P
  { id: 368, nombre: "Pain Management.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBNPhCLW8dPRIMlWnbHa12uAXqEBPOnYxEWHaFXu4k8sSE?CID=0b80586a-c054-71a9-94e5-cc83855def4e", departamento: "Clinical Policy" },
  { id: 369, nombre: "Palliative Care.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQA8QKyAf9HYSreoRW5i2k_kAdwYjqqYPn64JRzklx_Y-NI?CID=4745f97f-aa02-948b-36f1-b681648d34f3", departamento: "Clinical Policy" },
  { id: 370, nombre: "Pandemic Policy.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCpIUUGS92YR7UVAHEhBVE4AV1kEjxKz8vdC8O7pLKnv50?CID=32bfc219-6de3-3d99-1be9-b691710e6478", departamento: "Clinical Policy" },
  { id: 371, nombre: "Payactive Flyer.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/Payactiv-AccessFlyer-WithCard.pdf", departamento: "" },
  { id: 372, nombre: "Paychex Support Team.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2022/11/Paychex-Support-Team-Contacts.pdf", departamento: "" },
  { id: 373, nombre: "Pet Agreement.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/10/Pet-Agreement-WORD-DOC.docx", departamento: "" },
  { id: 374, nombre: "Personal Belongings.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/04/Personal-Belongings-Form.pdf", departamento: "" },
  { id: 375, nombre: "Personal Care Items Memory Care Policy.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQC7vGZcIAeDSLh9FbZQy88eAWaQsV7pwyGzZBoXhhAkCEI?CID=cdd28928-22a8-7b5b-a432-97cc683c7fc6", departamento: "Clinical Policy" },
  { id: 376, nombre: "Personal Protective Equipment.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBfv0QybTuOSbi-OkrS2A0rAWZiJK-S5WwgdTnCMOOb1hM?CID=bfc47611-cd83-5999-27ba-9d9fe75ebf74", departamento: "Clinical Policy" },
  { id: 377, nombre: "Personal Possesions Policy.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Personal-Possessions-Policy.docx", departamento: "Clinical Policy" },
  { id: 378, nombre: "Pets in the Community.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCv7UtIc_G1Q4vV_qp4U9xDAa7vj1lP--7EKNiFQEsx3cI?CID=e6bb0660-2b2a-74ad-81d0-b1ccb11b4111", departamento: "Clinical Policy" },
  { id: 379, nombre: "Physical Examination.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBFrWPeeLBtQoxsnlO5UeVeAWvU1AJHmIoAGHmoqoeyS_s?CID=ed2ac04b-b998-8210-146e-ed4bbaf2e869", departamento: "Clinical Policy" },
  { id: 380, nombre: "Physician Forms.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Atlas-Phyician-Forms-.pdf-pool-alcohol-version.pdf", departamento: "" },
  { id: 381, nombre: "Physician Orders.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBviLyO1KSySKM_I10hQQ8gAVJJso3JoiQswEP910hKa7c?CID=345626e9-b0ff-b9df-dc71-079cabbd2481", departamento: "Clinical Policy" },
  { id: 382, nombre: "Preventing Transmission Infection.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQA7TPnV_OWGQJrUKoXpFWcWAfMA8SZuQOENy8B1-XK13nE?CID=f3b27e9b-4f7d-e305-39b6-066084725d03", departamento: "Clinical Policy" },
  { id: 383, nombre: "Point Click Care Guidance.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Point-Click-Care-Guidance.docx", departamento: "" },
  { id: 384, nombre: "Point Click User Manual.link", letra: "P", link: "https://drive.google.com/file/d/1F_2vnb4YSnPiVcIp5Ezf1v23oej3QIOY/view?usp=sharing", departamento: "Redirect Link" },
  { id: 385, nombre: "Policy Review Check Off Orientation.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQC0dMR0ytutTL5DqHfvUcmsAVz_koJvL7kHU7bqf8ADQ34?CID=1a1e092c-3e5b-dd73-2855-b8cef925ba13", departamento: "" },
  { id: 386, nombre: "Oxygen Therapy Policy.docx", letra: "O", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQALcJDPuDg9TJWW40rH1o93AWeuFD_mwgos4pBtYQomP6A?CID=c0c24029-0e2a-75cf-6052-65970f3b3126", departamento: "Clinical Policy" },
  { id: 387, nombre: "POLST.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/POLST.pdf", departamento: "" },
  { id: 388, nombre: "Preventative Maintenance.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Property-Damage-Form-1.docx", departamento: "" },
  { id: 389, nombre: "Property Damage.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Property-Damage-Form-1.docx", departamento: "" },
  { id: 390, nombre: "Proxy Med Pass.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Proxy-med-pass-policy.docx", departamento: "Clinical Policy" },
  { id: 391, nombre: "Proxy or Volunteer Orientation Packet.pdf", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/personal/mrost_atlasseniorliving_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments%2FProxy%20or%20Volunteer%20orientation%20packet%2Epdf&parent=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments&ct=1780072748613&or=OWA%2DNT%2DMail&cid=56cee432%2Df861%2De379%2Dcd90%2Db7ded5ff5c29&ga=1", departamento: "" },
  { id: 392, nombre: "Power Failure and Water failure Policy.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCSJItJikRTQrbguLROjdm_AZtRX4LZ808zWTy2cgcxrwQ?CID=505ef595-953c-dce3-1370-3c4db263088e", departamento: "" },
  { id: 393, nombre: "Private Sitters Policy and Procedure.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDvi4QDpBPdQLjchElt4subAT4BUn-U1X_Fi-pYjPWtXjs?CID=87e23389-a451-4f48-faa3-1edf18d27e7d", departamento: "Clinical Policy" },
  { id: 394, nombre: "Psycotropic Review.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Psychotropic-Review-Policy.docx", departamento: "Clinical Policy" },
  { id: 395, nombre: "Pulse Ox Policy.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBEBl190qboQ5aKpJapExqrAeJPmdPZ-1R4BZFPw6L6sjU?CID=b8874790-d986-46fe-21b8-90d0ea4c16a0", departamento: "Clinical Policy" },
  { id: 396, nombre: "PTO Donation Policy.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/PTO-Donation-Form-Need-just-page-2.pdf", departamento: "" },
  { id: 397, nombre: "PTO Donation Form.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/07/Atlas-PTO-Donation-Form-2024.pdf", departamento: "" },
  { id: 398, nombre: "Peer Team Contact Info Ignite Training.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/06/Peer-team-contact-Info-Ignite-Training92.docx", departamento: "Clinical Policy" },
  // Q
  { id: 399, nombre: "Quality Assurance.docx", letra: "Q", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQD5uOxDUtn4SJ0VqnXUMCrVAQfZzdXpjK8e7517rbsiKg8?CID=51a500cc-d3f4-4502-42e2-3fb2c787e510", departamento: "Clinical Policy" },
  { id: 400, nombre: "Questions Support Team.pdf", letra: "Q", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Community-Support-Questions.pdf", departamento: "" },
  // R
  { id: 401, nombre: "Radar Report.xlsx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2025/08/Radar-Report-Updated-2025.xlsx", departamento: "Clinical Policy" },
  { id: 402, nombre: "Ready for Company Checklist.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/New-Format-Ready-for-Company-Checklist.docx", departamento: "" },
  { id: 403, nombre: "RedEApp Flyer.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/RedEApp-Flyer.pdf", departamento: "" },
  { id: 404, nombre: "Refusal of Services Policy.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDiqc3AInRvS7Zsv0W6Cw26Abw0-c_MKF36HbEQwOLf7e8?CID=88ee8ec5-7d76-574e-6802-8611daafbbd2", departamento: "Clinical Policy" },
  { id: 405, nombre: "Registered Nurse (RN).docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Registered-Nurse-RN.docx", departamento: "Job Description" },
  { id: 406, nombre: "Release of Deceased Resident.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Release-of-Deceased-Resident-to-Funeral-Director.pdf", departamento: "" },
  { id: 407, nombre: "Release of Medication.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Medication-Release-Policy25.docx", departamento: "Clinical Policy" },
  { id: 408, nombre: "Release Record.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Authorization-For-Release-of-Resident-Records.pdf", departamento: "" },
  { id: 409, nombre: "Rent Cafe Flyer.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2024/10/Rent-Cafe-Flyer.pdf", departamento: "" },
  { id: 410, nombre: "Rent Ready Checklist.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/Atlas_-_Rent_Ready_Checklist.pdf", departamento: "" },
  { id: 411, nombre: "Reportable Events.pdf", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/personal/mrost_atlasseniorliving_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments%2FReportable%2DEvents%2DPolicy%2D1%2Epdf&parent=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments&ct=1780073481013&or=OWA%2DNT%2DMail&cid=561ff17c%2Da323%2D4b8a%2Da61e%2D2ba7b9a1a26c&ga=1", departamento: "Clinical Policy" },
  { id: 412, nombre: "Resident Care Coordinator.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2026/02/Resident-Care-Coordinator.docx", departamento: "Clinical Policy" },
  { id: 413, nombre: "Resident Council Concern Response.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2024/08/Resident-Council-Concern-Response-Form.docx", departamento: "" },
  { id: 414, nombre: "Resident Council Meetings.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBrckVCKW8YSoPG3tb92XKRAU-oVhQcudD7gT-RGwMVlI8?CID=ad12fb21-e369-08da-0dfe-4a195baedcbb", departamento: "Clinical Policy" },
  { id: 415, nombre: "Resident Council Minutes.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBI28OFXwWET6fKSZvoJHz3AeXdmiq0CEJqzPN4_HLsXag?CID=91a72e13-b84d-e908-1e41-d36f387e6a29", departamento: "" },
  { id: 416, nombre: "Resident Pre-Admission.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2023/03/Pre-Admission-Assessment-Revised-3.29.23.pdf", departamento: "Clinical Policy" },
  { id: 417, nombre: "Resident Refusal Form.pdf", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/personal/mrost_atlasseniorliving_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments%2FResidentRefusalForm%2Epdf&parent=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments&ct=1780075212503&or=OWA%2DNT%2DMail&cid=d8118c41%2Dc041%2Daf4e%2D9e2d%2D147d11959bcd&ga=1", departamento: "" },
  { id: 418, nombre: "Resident Rights.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/RESIDENT-RIGHTS.docx", departamento: "Clinical Policy" },
  { id: 419, nombre: "Resident at Risk P&P.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDmFDErb_i_TptL-IJS7HqnATtP0GBzFIj2BH2eNnp_xT8?CID=2e4d1a36-cb08-9a4c-a9a9-bc85210f5c22", departamento: "Clinical Policy" },
  { id: 526, nombre: "Resident & Guest Sign In.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Resident-and-Guest-Sign-In-Sign-Out-Policy.docx", departamento: "Clinical Policy" },
  { id: 420, nombre: "Respite Move In Form.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Move-In-Form-Respite.pdf", departamento: "" },
  { id: 421, nombre: "Restraints & Bed Rail Use.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCpigXrH9FuQ6VhMfYHekFOAXwQcVEbRFec5D8tW04G3Os?CID=3c89e11d-8f5c-1712-aaf7-fd53af3dc216", departamento: "Clinical Policy" },
  { id: 422, nombre: "Respirator Fit Test.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Respirator-fit-test-record.pdf", departamento: "" },
  { id: 423, nombre: "Respite Addendum.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2025/10/Respite-Addendum.docx", departamento: "" },
  { id: 424, nombre: "Return From Hospitalization.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Return-from-Hospitalization-Checklist.pdf", departamento: "" },
  { id: 425, nombre: "Return from Hospital.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Return-from-Hospital-Policy.pdf", departamento: "Clinical Policy" },
  { id: 426, nombre: "Return to Work.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Return-to-work-Policy.pdf", departamento: "Clinical Policy" },
  { id: 427, nombre: "Request of Authorized Electronics.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2022/12/Request-for-Authorized-Electronic-Monitoring.pdf", departamento: "" },
  // S
  { id: 428, nombre: "Safety Physical Envmnt.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Safety-physical-environment-Policy.docx", departamento: "Clinical Policy" },
  { id: 429, nombre: "Salad Dressing.xlsx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Salad-Dressing.xlsx", departamento: "" },
  { id: 430, nombre: "Sales and Marketing Director.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Sales-and-Marketing-Director.docx", departamento: "Job Description" },
  { id: 431, nombre: "Sales & Marketing Standards.xlsx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Atlas-Standards-sales-marketing-.xlsx", departamento: "" },
  { id: 432, nombre: "Scabies Policy.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBDQ9RjiCjlSbZFcHW5kNm1AU0eWpDDeIw1g0Hc_-5jLi4?CID=f1ed9dee-36c1-c066-9af5-01f9a5f220e5", departamento: "Clinical Policy" },
  { id: 433, nombre: "Self Administering Medications.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Medication-Self-Administration-Policy.docx", departamento: "Clinical Policy" },
  { id: 434, nombre: "Schedule Availability.pdf", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/Schedule-Availability.pdf", departamento: "" },
  { id: 435, nombre: "Server.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/08/Server-Job-Description.docx", departamento: "Job Description" },
  { id: 436, nombre: "Sex Offender Registry.pdf", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/personal/mrost_atlasseniorliving_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments%2FSex%2DOffender%2DRegistry%2DPolicy%2D%2Epdf&parent=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments&ct=1780076510367&or=OWA%2DNT%2DMail&cid=690cf905%2Dd6f2%2Ddd2f%2Db19d%2D228f1e2b651f&ga=1", departamento: "Clinical Policy" },
  { id: 437, nombre: "Sharps Exposure.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAUuZuxM4UWR6leXmGnBiCrAfqc19zTrRe7deOOlsa8OzY?CID=72a5e385-c7a9-bef3-1a7f-47233996ebed", departamento: "Clinical Policy" },
  { id: 438, nombre: "Shift Report.pdf", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Shift-report-policy.pdf", departamento: "Clinical Policy" },
  { id: 439, nombre: "Shingles Policy & Procedure.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQC6Zxi_u_9QTL5a0vsZUgZiATEgakvxwTXg3DXGhkVdVho?CID=42bfb35f-1ce6-adaf-b98d-62e514706fec", departamento: "Clinical Policy" },
  { id: 440, nombre: "Shoe Policy.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Atlas-Shoe-Policy.docx", departamento: "" },
  { id: 441, nombre: "Skin Integrity.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAiFJ8WzX8VTIE2jXWnfrcxAYIBvkA8pByRq0lpywu6Dio?CID=aff165ed-68b8-8912-7764-980f677e970e", departamento: "Clinical Policy" },
  { id: 442, nombre: "Smoking.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQArHLSz3zHuTboi4Be5bvl9AZXUC-Odc-xJC78U5t760kI?CID=5d483fd1-9a93-3603-64d1-f0f57a4eaf26", departamento: "Clinical Policy" },
  { id: 443, nombre: "Smoke Free Environment.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBTfpz5tV0ARoPEkGX1jfrOARtT62eo3bTiMXciJPGE1ps?CID=7d5cd638-c0ff-ee3a-5252-2f78f5086140", departamento: "Clinical Policy" },
  { id: 444, nombre: "Sous Chef.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Sous-Chef.docx", departamento: "Job Description" },
  { id: 445, nombre: "SPIRIT Activity Assesment.pdf", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Atlas_Spirit-Activity-Assessment_Flyer.pdf", departamento: "" },
  { id: 446, nombre: "SPIRIT Bingo Activities.xlsx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Spirit_Bingo-Activities.xlsx", departamento: "" },
  { id: 447, nombre: "SPIRIT Indiviualized Activities.pdf", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Atlas_Spirit-Indivdualized-Activities_Flyer-.pdf", departamento: "" },
  { id: 448, nombre: "SPIRIT MC Care Standards.xlsx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2024/09/Atlas-SPIRIT-Standards-2024.xlsx", departamento: "" },
  { id: 449, nombre: "SPIRIT Program Flyer.pdf", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/Atlas_Spirit_Program_Flyer_Hi-Res.pdf", departamento: "" },
  { id: 450, nombre: "SPIRIT 5 Dimensions of Wellness.pdf", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2024/09/SPIRIT_Academy_Component.pdf", departamento: "" },
  { id: 451, nombre: "Staffing.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQArHLSz3zHuTboi4Be5bvl9AZXUC-Odc-xJC78U5t760kI?CID=5dace1f0-ab55-c5d0-dafd-989490855506", departamento: "Clinical Policy" },
  { id: 452, nombre: "Staff Education and Monitoring Infection Control.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDifTTQga_cSJ5lScxw9udiAVKxdhQMeU6Bv3JxfSEQSAU?CID=d82887f8-3081-e53a-3927-f886eed7d18a", departamento: "Clinical Policy" },
  { id: 453, nombre: "Standard Precautions.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDVWjOPBMtDQ6j5NHadhfFIAVfZhgtS65h77scHKoSQsNE?CID=b8c256ba-9b21-26be-7101-26256156090c", departamento: "Clinical Policy" },
  { id: 454, nombre: "Storage of Medications.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Storage-of-Medications-Policy-1.docx", departamento: "Clinical Policy" },
  // T
  { id: 455, nombre: "Transmission Based Precautions Inf Control.docx", letra: "T", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBYDGqW7BwRRaf4KtwIfBS5AYaHjfDV9Du2tlJEIdQk8WI?CID=4a35d3fb-9df0-fb47-535f-d14f20d0d10d", departamento: "" },
  { id: 456, nombre: "Team Building Ice Breaker Questions.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2025/06/Team-Building-Ice-Breaker-Questions22.docx", departamento: "" },
  { id: 457, nombre: "Telephone Reference Check.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Telephone-Reference-Check.docx", departamento: "" },
  { id: 458, nombre: "Temp Log.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Temp-Log-2024.docx", departamento: "Clinical Policy" },
  { id: 459, nombre: "Termination.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2022/12/Termination-Form.docx", departamento: "" },
  { id: 460, nombre: "The Work Number Cover.pdf", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2023/03/7904Letter_Cover_TheWorkNumber.pdf", departamento: "" },
  { id: 461, nombre: "The Work Number (Employee).pdf", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2023/03/7904Flyer_TheWorkNumber_Employee.pdf", departamento: "" },
  { id: 462, nombre: "The Work Number (Requester).pdf", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2023/03/7904Flyer_TheWorkNumber_Requester.pdf", departamento: "" },
  { id: 463, nombre: "Therapeutic Activities Policy Memory Care GA.docx", letra: "T", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAm5fMXm1IYTZ_rkIQukcuAAXi2J3xTuKdYcnotYogygZk?CID=4a60b2be-ebf8-ca7f-44e6-c0b0d8cd90bc", departamento: "Clinical Policy" },
  { id: 464, nombre: "Third Party Provider.docx", letra: "T", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBFvGx21q-aRL77RqVB8FBEAb0w3ORugcF0TRsfYfchQ_A?CID=d05336dc-3d39-b9db-ba32-149056fe0b45", departamento: "Clinical Policy" },
  { id: 465, nombre: "Time Sheet Form.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2022/07/Atlas_Time-Sheet.doc", departamento: "" },
  { id: 466, nombre: "Time Card Adjustment Form.pdf", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2025/06/Atlas-Timecard-Adjustment-Form.pdf", departamento: "" },
  { id: 467, nombre: "Training Checklist.pdf", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Training-Checklist.pdf", departamento: "" },
  { id: 468, nombre: "Training Sign In Sheet.pdf", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Training-Sign-In-Sheet.pdf", departamento: "" },
  { id: 469, nombre: "Transportation Services.docx", letra: "T", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDnyhd-8LNMQ7pDpiTUqxlqAfJscC_FDezGKIooYC_NFtQ?CID=c1ba41b2-a1f0-b7da-4b22-3ede27beda98", departamento: "Clinical Policy" },
  { id: 470, nombre: "Tornado Drill Policy.docx", letra: "T", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCq531qmGF7QIgKJdAYp8v9AR2zltDJ7GSu2qfaASQtKOU?CID=7ae3ca8e-c687-2a7a-4a61-e036f1ef5d0b", departamento: "Clinical Policy" },
  { id: 471, nombre: "Tuberculosis.docx", letra: "T", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQD_DpJ2ZPGzTZ-wqBAmVQE9Ad-SHf0jhGc14KNwF1XrKik?CID=bfce93d4-9fdc-b83f-4990-07cd0e5b02f2", departamento: "Clinical Policy" },
  // U
  { id: 472, nombre: "Use of Bed Rails.docx", letra: "U", link: "https://atlasseniorliving.net/wp-content/uploads/2025/09/40-Bed-railsdme.docx", departamento: "" },
  { id: 473, nombre: "Use of Restraints.docx", letra: "U", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCuXr0_NT6WRZsHATlNebHLAW1Q7Rw8xMJBEoLESdufyFg?CID=ee1f087b-b484-447c-8f7c-33e9666f75bf", departamento: "Clinical Policy" },
  { id: 474, nombre: "Unlocked Clinical Standards.xlsx", letra: "U", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Unlocked-Clinical-Atlas-Standards.xlsx", departamento: "Clinical Policy" },
  { id: 475, nombre: "UTO Unit Turn Request.docx", letra: "U", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/UTO-Unit-Turn-Request.doc", departamento: "" },
  // V
  { id: 476, nombre: "Vaccination.docx", letra: "V", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAyGmC9QM_mSpI9Cc8GkSc1AXvHNLnd8Uto-BopnINvhnw?CID=7b98d8a5-3e30-0fc0-6949-56581ee02e5c", departamento: "Clinical Policy" },
  { id: 477, nombre: "VA Residency Addendum.docx", letra: "V", link: "https://www.atlasseniorliving.net/wp-content/uploads/2022/02/va_addendum_1.docx", departamento: "" },
  { id: 478, nombre: "Video Surveillance.docx", letra: "V", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAt-9ZU3M11T4NJQDVegb-1AYVdf-q5AJguHu7Y8G2SJhU?CID=46cdb1cf-246a-b453-2bb1-56a4702248eb", departamento: "Clinical Policy" },
  { id: 479, nombre: "Visitation Policy Florida.docx", letra: "V", link: "https://atlasseniorliving.net/wp-content/uploads/2025/09/2025-visitation-florida-policy.docx", departamento: "Clinical Policy" },
  { id: 480, nombre: "Visitor Sign In Log.pdf", letra: "V", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Visitor-SignIn-Log-9.26.22.pdf", departamento: "" },
  { id: 481, nombre: "Vital Signs.docx", letra: "V", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Vital-Signs-Policy.docx", departamento: "Clinical Policy" },
  { id: 482, nombre: "Volunteer Orientation Checklist.docx", letra: "V", link: "https://atlasseniorliving.net/wp-content/uploads/2025/01/Volunteer-Orientation-Checklist-Questions-003.docx", departamento: "" },
  { id: 483, nombre: "Volunteer Profile.docx", letra: "V", link: "https://atlasseniorliving.net/wp-content/uploads/2025/01/Volunteer-Profile.docx", departamento: "" },
  { id: 484, nombre: "Volunter Policy.docx", letra: "V", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Policy-Volunteer.docx", departamento: "Clinical Policy" },
  { id: 485, nombre: "Volunteer Parental Consent Form.pdf", letra: "V", link: "https://atlasseniorliving.net/wp-content/uploads/2025/01/Volunteer-Parental-Consent-Form-Minors.pdf", departamento: "" },
  { id: 486, nombre: "Volunteer Service Statement.pdf", letra: "V", link: "https://atlasseniorliving.net/wp-content/uploads/2025/01/Volunteer-Service-Statement.pdf", departamento: "" },
  // W
  { id: 487, nombre: "Wait list - Community Fee Receipt.pdf", letra: "W", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/Atlas-Wait_List_Community_Fee_Receipt.pdf", departamento: "" },
  { id: 488, nombre: "Walk-in Temperature.xlsx", letra: "W", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Walk-in-temperature.xlsx", departamento: "" },
  { id: 489, nombre: "Weapons.docx", letra: "W", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQA_aNl1yQ0TTLEsKpo0G3icARILKL1zS19wkEadApYTJ-8?CID=8dcac321-2cb4-2d0a-558d-8538d16e9d2f", departamento: "Clinical Policy" },
  { id: 490, nombre: "Weighing Residents.docx", letra: "W", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQA2PuPBkZXISpVP63675rhzAVD3Ogb66eD13KehNgc3S1s?CID=b39ac732-a03f-fdb7-2445-38f83f289b54", departamento: "Clinical Policy" },
  { id: 491, nombre: "Weight Loss Management.docx", letra: "W", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBJ62T_2JjEQaRRDcE4QFUlAaPqoWxsArLbgZ-rc80a56c?e=yR5QRY", departamento: "Clinical Policy" },
  { id: 492, nombre: "Welcome to the Team Page.docx", letra: "W", link: "https://atlasseniorliving.net/welcome-to-the-team-page/", departamento: "" },
  { id: 493, nombre: "Wellness Director.docx", letra: "W", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Wellness-Director.docx", departamento: "Job Description" },
  // Alabama
  { id: 496, nombre: "Assessment Policy.docx", estado: "ALABAMA", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBECE-ct6gdRYtQX90R4z3nARx9OPgjUy_Cn4kV2is4iJA?e=kd78Kd", departamento: "Clinical Policy" },
  { id: 497, nombre: "Admission Discharge Policy SCALF.docx", estado: "ALABAMA", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQApo7-Pm4JwTrsX42wkp4sbAZ8FLXfqknKtgY9zE4vdhUg?e=a58hCN", departamento: "" },
  { id: 498, nombre: "DNR Alabama.pdf", estado: "ALABAMA", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDcZb_pVvxwSajy9sRjQKn5Aa8WPbcLMcZekcrvOL1mfDE?e=JyLUZb", departamento: "" },
  { id: 499, nombre: "Family & Move-In Form.docx", estado: "ALABAMA", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-Alabama.docx", departamento: "" },
  { id: 500, nombre: "Family & Move-In Form.pdf", estado: "ALABAMA", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-Alabama.pdf", departamento: "" },
  // Florida
  { id: 501, nombre: "Admission Criteria Policy.docx", estado: "FLORIDA", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQA10uzEON_NQZq7hAUlbfVZAXKT1XTSezEjbjyOwPyvOUU?e=hx18Vf", departamento: "Clinical Policy" },
  { id: 502, nombre: "Family & Move-In Form.pdf", estado: "FLORIDA", link: "https://atlasseniorliving.net/wp-content/uploads/2025/05/Atlas-Family-and-Movein-Forms-Florida.pdf", departamento: "" },
  { id: 503, nombre: "Florida Do Not Resucitate.pdf", estado: "FLORIDA", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Florida-Do-Not-Resuscitate-Policy.pdf", departamento: "Clinical Policy" },
  { id: 504, nombre: "FL Move In Checklist.pdf", estado: "FLORIDA", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/FL-Move-In-Checklist.pdf", departamento: "" },
  { id: 505, nombre: "Florida Rules and Regulations.link", estado: "FLORIDA", link: "https://ahca.myflorida.com/MCHQ/Health_Facility_Regulation/Assisted_Living/alf.shtml", departamento: "Redirect Link" },
  // Georgia
  { id: 506, nombre: "Family & Move-In Form.docx", estado: "GEORGIA", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-Georgia.docx", departamento: "" },
  { id: 507, nombre: "Family & Move-In Form.pdf", estado: "GEORGIA", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-Georgia.pdf", departamento: "" },
  { id: 508, nombre: "Med Pass Competency Checklist.pdf", estado: "GEORGIA", link: "https://atlasseniorliving-my.sharepoint.com/:b:/p/grosales/IQAT0WbPa4CFR5xJHDxabeuJAYjIkem8ywJmfFfCH1XWxpc?e=6oEbvz", departamento: "" },
  { id: 509, nombre: "Medication Aid Policy.docx", estado: "GEORGIA", link: "https://atlasseniorliving.net/wp-content/uploads/2026/01/GA-Medication-Aid-Policy.pdf", departamento: "Clinical Policy" },
  // Kentucky
  { id: 510, nombre: "Family & Move-In Form.docx", estado: "KENTUCKY", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-Kentucky.docx", departamento: "" },
  { id: 511, nombre: "Family & Move-In Form.pdf", estado: "KENTUCKY", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-Kentucky.pdf", departamento: "" },
  // Mississippi
  { id: 512, nombre: "Family & Move-In Form.docx", estado: "MISSISSIPPI", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-Mississippi.docx", departamento: "" },
  { id: 513, nombre: "Family & Move-In Form.pdf", estado: "MISSISSIPPI", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-Mississippi.pdf", departamento: "" },
  // South Carolina
  { id: 514, nombre: "Family & Move-In Form.docx", estado: "SOUTH CAROLINA", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-South-Carolina.docx", departamento: "" },
  { id: 515, nombre: "Family & Move-In Form.pdf", estado: "SOUTH CAROLINA", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-South-Carolina.pdf", departamento: "" },
  { id: 516, nombre: "SC Alzheimers Policy.docx", estado: "SOUTH CAROLINA", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/SC-Alzheimers-policy.docx", departamento: "Clinical Policy" },
  { id: 517, nombre: "SC Activities Policy.docx", estado: "SOUTH CAROLINA", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/SC-activities-policy.docx", departamento: "Clinical Policy" },
  { id: 518, nombre: "SC Maintenance Policy.docx", estado: "SOUTH CAROLINA", link: "https://atlasseniorliving.net/wp-content/uploads/2023/03/SC-maintenance-policy.docx", departamento: "Clinical Policy" },
  { id: 519, nombre: "SC Meal Policy.docx", estado: "SOUTH CAROLINA", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/SC-meal-policy.docx", departamento: "Clinical Policy" },
  { id: 520, nombre: "SC Private Sitter Policy.docx", estado: "SOUTH CAROLINA", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/SC-private-sitter-policy.docx", departamento: "Clinical Policy" },
  { id: 521, nombre: "SC Visitation.pdf", estado: "SOUTH CAROLINA", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/SC-visitation-policy-11222021.pdf", departamento: "Clinical Policy" },
  // Tennessee
  { id: 522, nombre: "Family & Move-In Form.docx", estado: "TENNESSEE", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-Tennessee.docx", departamento: "" },
  { id: 523, nombre: "Family & Move-In Form.pdf", estado: "TENNESSEE", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-Tennessee.pdf", departamento: "" },
  // Texas
  { id: 524, nombre: "Family & Move-In Form.docx", estado: "TEXAS", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-Texas.docx", departamento: "" },
  { id: 525, nombre: "Family & Move-In Form.pdf", estado: "TEXAS", link: "https://atlasseniorliving.net/wp-content/uploads/2023/04/Atlas-Family-and-Movein-Forms-Texas.pdf", departamento: "" },
  // Miscellaneous
  { id: 527, nombre: "Wheelchair Van Lift Policy.docx", letra: "W", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAq1fUGslktTbffETr-mBgUAeSpUpbgsSlsrDuHmH-aeYs?e=A6yud2", departamento: "Clinical Policy" },
  // Melissa Files
  { id: 600, nombre: "Third Party Healthcare Company Agreement.docx", letra: "T", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCqNnydhAOFSZGh72qBKSmeAVVsiFuoblP5i8WPJ68VsUE?CID=b162171c-a24d-b31e-0192-5d56314f16d1", departamento: "" },
  { id: 601, nombre: "19d Atlas CMA - Nursing Training Days 1-3.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCGPWrsP4d7RIqB_R21hXICARW_cmuttLzid4uVgsnKxDQ?CID=898a904b-c84a-78a4-9b16-8da2b90b4c52", departamento: "Job Description" },
  { id: 602, nombre: "Atlas CNA - Caregiver Training Days 1-3.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBUH09d6-sNQYCj2IbdSwIBASZOOuftpY9ht2-a84RJa7E?CID=c7501ae6-b494-a4ef-4c36-a3d3a6e08409", departamento: "Job Description" },
  { id: 603, nombre: "Atlas Key Fob Full Policy and Aknowledgement.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAo4W91w5GmSbwVn174EFBPAfiNTFd1Ne9zeasMIOFR8Rs?CID=cf578983-002b-38e4-223f-7f4acd02121b", departamento: "Clinical Policy" },
  { id: 604, nombre: "Atlas Wheelchair Van Lift and Securement Policy.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQB7mPjySXN0SLz0YmT0uHWRAVTNpGOfdKOjileAv7JYmfE?CID=25a864cd-3bbf-2bad-e128-b94db18da2ec", departamento: "Clinical Policy" },
  { id: 605, nombre: "Atlas Levels of Care.pdf", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/personal/mrost_atlasseniorliving_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments%2FAtlas%2DLevels%5Fof%5FCare%2Epdf&parent=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments&ct=1779995321519&or=OWA%2DNT%2DMail&cid=888e7244%2Dc716%2D0ce0%2Dcc9a%2D805a0d1c2856&ga=1", departamento: "" },
  { id: 606, nombre: "Care Plan Policy.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQB_mQHgK89fR6zm0a1vt18EAa3VeHIMRMViTGBNRB9eiwM?CID=48263c2d-4be1-b883-5fdd-8c37792b4f64", departamento: "Clinical Policy" },
  { id: 607, nombre: "Destruction of Discontinued Medications log 2.docx", letra: "D", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBBf7AeUhQ5R5-8cLVmfA91AYlKnOCI9FS60f6Xvz57KIw?CID=79df50aa-ee78-4a2c-e8e8-152b403d3d0f", departamento: "" },
  { id: 608, nombre: "ECC LNS Review.pdf", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/personal/mrost_atlasseniorliving_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments%2FECC%20LNS%20Review%2Epdf&parent=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments&ct=1779996227920&or=OWA%2DNT%2DMail&cid=4a79deb1%2Df541%2Db4ba%2Dc0f8%2Dd5e4caef6155&ga=1", departamento: "" },
  { id: 609, nombre: "Electric Scooter Policy Assisted Living Atlas.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDiLK01JQwmQKiQIF-PEkn1AbOQ_hvZoZmz0NcNOA7MT6s?CID=a95be5c4-0d09-15e4-b1e0-bdaa2770372c", departamento: "" },
  { id: 610, nombre: "Electronic Monitoring Policy Rooms.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAjqIojaqsLQZF7q1V2da5eAe-JmyAUCQuJFYflHof09pY?CID=f93d1238-1207-91c6-bb44-f7a01a1874b3", departamento: "Clinical Policy" },
  { id: 612, nombre: "Electronic Monitoring Policy.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQA1d-HfyIbkQ6dpe9intQGxAYDWRGmggxkdGjVxTw4r6aM?CID=b01b1e84-6416-7499-af62-77f05a0f6b66", departamento: "Clinical Policy" },
  { id: 613, nombre: "Electronic Monitoring Poster.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAjqfK_F_hXQ5eNFYsxn9-ZAe_UdbyXTZK9uJGC6Z36IxY?CID=85044e87-36e8-9838-12e1-286fd3dbbb23", departamento: "" },
  { id: 614, nombre: "Elopement Drill Form.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAIX5Eqcde8QZlu6GUI46QRAWRTvImc-Qm1XYKwPOfr89I?CID=b10015e7-6c8e-fd1e-f880-774006c230fa", departamento: "" },
  { id: 615, nombre: "Emergency Lighting Policy.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDX9807gZWlSqTUhR5CbrcPAZjoJUkcoZDMaFjupx5dOls?CID=612dd79d-20a3-9412-525d-7996662897b3", departamento: "Clinical Policy" },
  { id: 616, nombre: "Fire Drill Form.pdf", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/personal/mrost_atlasseniorliving_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments%2FFire%20Drill%20Form%2Epdf&parent=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments&ct=1780003081618&or=OWA%2DNT%2DMail&cid=6d40afe9%2De80c%2Daacf%2Dca01%2D5ee00525b199&ga=1", departamento: "" },
  { id: 617, nombre: "Flu Vaccine Declination.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQC1iPvB54RpTq_Epag4GTmlAQLJ-szuL6LtAY4uqjNdLgI?CID=42655317-3525-a619-30ab-9a448b262d1f", departamento: "" },
  { id: 618, nombre: "Fraud Policy.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAYAtAMG_RKQZWpEsvABKVRAYLHoxA2c7rrswnFCnQupYw?CID=2b09b333-215e-6eb6-62b4-d8fbf6317189", departamento: "Clinical Policy" },
  { id: 619, nombre: "Grievance Form.pdf", letra: "G", link: "https://atlasseniorliving-my.sharepoint.com/personal/mrost_atlasseniorliving_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments%2FGrievance%20form%2Epdf&parent=%2Fpersonal%2Fmrost%5Fatlasseniorliving%5Fcom%2FDocuments%2FAttachments&ct=1780003515790&or=OWA%2DNT%2DMail&cid=d39245bc%2Dbb65%2D0217%2D8b56%2Dfb568fc2efa7&ga=1", departamento: "" },
  { id: 620, nombre: "Ignite Orientation Certificate of Completion.docx", letra: "I", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAsZQqBWiRSQKccAUu8InN9AR_xDVGF9W9f3Pmp90FzEms?CID=43141c7a-78b5-bb22-36d2-01d21219f387", departamento: "" },
  { id: 621, nombre: "Key Fob Full Tracking.xlsx", letra: "K", link: "https://atlasseniorliving-my.sharepoint.com/:x:/p/mrost/IQBlCXiUVjJgRqeUC5g66PMgAZXa0BhC1-rVilKS7SbRjOc?CID=c54bb20c-b6c6-89f5-32da-c4fdd80d6f7a", departamento: "" },
  { id: 622, nombre: "Medical Record Requests Policy 2025.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDDNAmxyvYPQqi1Ur58YsHmAbKGbjmGSAWRPSAaarM7Dnk?CID=f0c0d374-7b5a-1226-e9d2-e99ee0cf6c87", departamento: "Clinical Policy" },
  { id: 623, nombre: "Medical Record Fee Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBvk_rMMSAWQZe_KbiPSJzdAZv-Y53_J_zzypfxdaCaVEA?CID=b3b3f02a-4c9c-7905-85fb-abf62f08994d", departamento: "Clinical Policy" },
  { id: 624, nombre: "Medical Record Fees 2025.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBKQ4_eUM0lT7Fj51QeinA3AYB6YiBejMTa31k4_EOD_40?CID=f1817be9-97f3-4743-7d26-81b423d1d175", departamento: "" },
  { id: 625, nombre: "Medication Aide Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBxjbgnTFHwRIQL2YTiWCWgASWCFCHSYgKlMuknDN11JU4?CID=8dd593fc-3c34-1535-2674-e50438bae7a1", departamento: "Clinical Policy" },
  { id: 626, nombre: "Medication Cart Audit.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAgzbjP62W8QYTESUxEuszIATRKNaNqEEaJd8OUOHWjHKo?CID=8baed869-1683-4808-45c0-524a40f80781", departamento: "" },
  { id: 627, nombre: "Medication Destruction Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBqtrnNv911RK20bDLTlSpoAbE8bJgdVcrd9Dr6sFNcR-Q?CID=e4d92b23-a4f8-df10-661d-cc50dd4fc400", departamento: "Clinical Policy" },
  { id: 628, nombre: "Medication Storage Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDoZmFITnWLR7_M72huk3aRAfUZg-SqHiVA3OKLwqjihz8?CID=32c6c32f-0307-30f9-929d-00e98fe23218", departamento: "Clinical Policy" },
  { id: 629, nombre: "Memory Care Admission Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQA5M_qaVezkR5xH0XxCGJrZAZap6OIj55-DTF7W8N_iZXU?CID=783a4918-e0a3-e37c-caa1-a3d2711b0c7f", departamento: "Clinical Policy" },
  { id: 630, nombre: "Monthly Quality Assurance Meeting Minutes.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCgk4mD7Eq1T5QDVuX_xC-cAV0NRBwaazd_YNDE1gaFK1w?CID=a0fc85a8-8801-4e9d-898b-8c836c178316", departamento: "" },
  { id: 631, nombre: "Nurse Supervisor.docx", letra: "N", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDeUy1PoI--TLmbaBpeMp16AQjBHQnk1C1mX4_jusBNxLo?CID=c74a623c-60f5-652b-3baa-5a06a1eba8da", departamento: "Job Description" },
  { id: 632, nombre: "Onboarding Policy.docx", letra: "O", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCAlWvRFQrrSbEfOSRTJx57AVDWisV_UDGn4_ZHfdT9xoQ?CID=717d9509-df38-3ac5-2570-1e2caa6299b4", departamento: "Clinical Policy" },
  { id: 633, nombre: "Pharmacy Policy.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAP35oTtxZvRbQQquw7ApbqATWsjOHtZZjVFWspI1yvbnI?CID=f4fd0b19-ecc4-1ef4-1768-3f5f4ece9d9d", departamento: "Clinical Policy" },
  { id: 634, nombre: "Policy Volunteer.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQD3994IO8VlT42DRxPlAb_bAfVQQ1ymwVyaxX608tOtv5E?CID=94d1e4c0-265c-802b-4f29-5edf53c1c3bd", departamento: "Clinical Policy" },
  { id: 635, nombre: "PP Backup Pharmacy.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBhOyKTjuD3RLPH3FY3ryqPAaG43FYntYsTIILqXx3k6dg?CID=b5713486-6e0a-bcec-2be8-81b4f802113b", departamento: "" },
  { id: 636, nombre: "Progress Notes.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBt_jRotyGtS70mou5bVLI7AfMnuOqMQa0bzpTLRe2MWpw?CID=23721b55-fd2a-b11d-1581-1263d3c1f6f3", departamento: "" },
  { id: 637, nombre: "Psychotropic Medication Policy.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQB2OA5BOUHQT7vxGJ12_pBTAfDjxawujDiiiuOVijYHrjE?CID=5e0a3a77-1687-a5f5-04e1-9d3f5584f5f6", departamento: "Clinical Policy" },
  { id: 638, nombre: "Resident Care Coordinator Job Duties.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDsAKPS8fo8RJy8RdMAbLz7AfthwMxNMX4QM39f_B0ef-E?CID=f5c071bc-e15a-cbb4-565b-035a5ee246ee", departamento: "Job Description" },
  { id: 639, nombre: "Resident Inventory Policy.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQD43DH-h5piSKAShsmEmbroAd3CbUK5Hywfz1W5yqSZE34?CID=eddea513-0845-522b-fb16-f88ce0d878da", departamento: "Clinical Policy" },
  { id: 640, nombre: "Resident Record Request Form.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQAGVGobsFIGQrBSwRqj3ZsYAbe9bcYbD0lUkBU7SQYkiT8?CID=00b898d3-8075-9211-5549-f205232df0f2", departamento: "" },
  { id: 641, nombre: "Resident and Guest Sign In Sign Out Policy.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQDIvPqFDU8tTJ-tcYf-3vD-AQvSfnOOYTC5YRUbiHLazp8?CID=16ecb205-89f2-9398-8d27-c3b025e32970", departamento: "Clinical Policy" },
  { id: 642, nombre: "Safely you Policy and Procedure for Atlas.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCSzvtKRjeyQL6lTzzdcJ2jASN67jkJL16Wtsfj0SjFbjE?CID=90abcf8c-888d-be20-8bb2-0a780fe7c5b0", departamento: "Clinical Policy" },
  { id: 643, nombre: "Safely Physical Enviroment Policy.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBxnkY-F8X3T5oK3uBcs3_3AVt5NB1NKv5pFSagtdOw41I?CT=1780076383855&OR=OWA-NT-Mail&CID=1d0d95b1-5598-138b-18c6-cd8791f66c0c", departamento: "Clinical Policy" },
  { id: 644, nombre: "Shared showers.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQBtMgdCNMDASbP0R3cd-QW-AdANvH2pm34ABvlCM0x9JfM?CID=51874673-1b55-842b-13d3-57469ab351d5", departamento: "" },
  { id: 645, nombre: "Skin Assessment Form.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQA2c16iVHmZSY4c1ZX5NWICAXWB1ieumNeYEWk6JnGm0V4?CID=0d8a888f-0aa8-17a6-8cbd-64048d52766b", departamento: "" },
  { id: 646, nombre: "Smoking Eval form.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQCcxuO2pnOVTbAInuTnM2XoATXktuCEtmh3LfMTMH-JBLU?CID=e1b59126-9a38-5c13-7177-aeab11d9761a", departamento: "" },
  { id: 647, nombre: "Subpoena Records Response Checklist.docx", letra: "S", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQD8FJdXtNLdQbJ7Pv51Oxl5AXWRfGOu1t3a1kpQOtGfgsc?CID=60f612f6-bf59-52b0-1239-253ecd7064bd", departamento: "" },
  { id: 648, nombre: "Weekly Leadership Meeting Form.docx", letra: "W", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/mrost/IQA1MJpdcjnzS4cObiwOSYXiAbgn9iLxQhB_gtHHGphASFs?CID=dc44d066-1aa5-2fb4-36f3-889a82faa935", departamento: "" },
  { id: 649, nombre: "Master Key Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/r/personal/fpatino_atlasseniorliving_com/_layouts/15/Doc.aspx?sourcedoc=%7B50AE55AB-2CD0-480E-8B33-ABE2CEA43939%7D&file=Master%20key%20policy.docx&action=default&mobileredirect=true", departamento: "Clinical Policy" },
  { id: 650, nombre: "MC Courtyard Access Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/r/personal/fpatino_atlasseniorliving_com/_layouts/15/Doc.aspx?sourcedoc=%7BCEE67111-25A1-45B5-8091-41FC84272308%7D&file=MC%20Courtyard%20Access%20Policy.docx&action=default&mobileredirect=true", departamento: "Clinical Policy" },
  { id: 651, nombre: "Regional Clinical Job Description.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/r/personal/fpatino_atlasseniorliving_com/_layouts/15/Doc.aspx?sourcedoc=%7BBF8B0B44-5E5A-4EBA-AA34-159B2E20DA7E%7D&file=Regional%20Clinical%20Job%20description.docx&action=default&mobileredirect=true", departamento: "Job Description" },
  { id: 652, nombre: "Move In Form (New) All Inclusive Florida.pdf", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/my?viewid=9ec7daf6%2D1e1d%2D4d92%2D94c5%2Dd4a0fce5342c&id=%2Fpersonal%2Ffpatino%5Fatlasseniorliving%5Fcom%2FDocuments%2FForms%20Hub%2FMove%20In%20Form%20%28new%29%20all%20inclusive%20Florida%2Epdf&parent=%2Fpersonal%2Ffpatino%5Fatlasseniorliving%5Fcom%2FDocuments%2FForms%20Hub", departamento: "" },
  { id: 653, nombre: "Assisted Living Nurse Progress Note.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/r/personal/fpatino_atlasseniorliving_com/_layouts/15/Doc.aspx?sourcedoc=%7BC4BBA2F4-58CB-4340-BD07-EB6E21084C0F%7D&file=Assisted%20Living%20Nurse%20Progress%20Note.docx&action=default&mobileredirect=true", departamento: "" },
  { id: 654, nombre: "Dietary Cross Contamination Prevention Policy.docx", letra: "D", link: "https://atlasseniorliving-my.sharepoint.com/:w:/r/personal/fpatino_atlasseniorliving_com/_layouts/15/Doc.aspx?sourcedoc=%7BB5C39B1F-BCA5-48CE-8EA0-680FD9A4FB1E%7D&file=Dietary%20Cross.Contamination%20Prevention%20Policy.docx&action=default&mobileredirect=true", departamento: "Clinical Policy" },
  { id: 655, nombre: "Resident Records Evac Protection Policy.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/r/personal/fpatino_atlasseniorliving_com/_layouts/15/Doc.aspx?sourcedoc=%7B0EE33A13-CD0B-470A-A7A8-CB9F640B7F04%7D&file=Resident%20Records%20Evac%20Protection%20Policy.docx&action=default&mobileredirect=true", departamento: "Clinical Policy" },
  { id: 656, nombre: "EPP EMC Notification Policy.docx", letra: "E", link: "https://atlasseniorliving-my.sharepoint.com/:w:/r/personal/fpatino_atlasseniorliving_com/_layouts/15/Doc.aspx?sourcedoc=%7B81D54534-5A43-4F25-A7D0-1D1EA3E1F62E%7D&file=EPP%20EMC%20Notification%20Policy.docx&action=default&mobileredirect=true", departamento: "Clinical Policy" },
  { id: 657, nombre: "Atlas Hospice Visit Notes One Page.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/r/personal/fpatino_atlasseniorliving_com/_layouts/15/Doc.aspx?sourcedoc=%7B1C3A8EB7-752F-4858-B6B8-FDE6C01CAEEB%7D&file=Atlas_Hospice_Visit_Notes_One_Page.docx&action=default&mobileredirect=true", departamento: "" },
  { id: 658, nombre: "Atlas Grievance Concern Report One Page.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/r/personal/fpatino_atlasseniorliving_com/_layouts/15/Doc.aspx?sourcedoc=%7BF8AF91FE-8196-4569-974E-468BC51D1274%7D&file=Atlas_Grievance_Concern_Report_One_Page.docx&action=default&mobileredirect=true", departamento: "" },


  // Ricky Kirk
  { id: 700, nombre: "Foodborne Illness Poster Atlas.pdf", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/my?viewid=9ec7daf6%2D1e1d%2D4d92%2D94c5%2Dd4a0fce5342c&id=%2Fpersonal%2Ffpatino%5Fatlasseniorliving%5Fcom%2FDocuments%2FForms%20Hub%2FFoodborne%20Illness%20Poster%20%2D%20Atlas%2Epdf&parent=%2Fpersonal%2Ffpatino%5Fatlasseniorliving%5Fcom%2FDocuments%2FForms%20Hub", departamento: "" },

];

const CATEGORIAS = ['All', 'Clinical Policy', 'Job Description', 'Redirect Link'];

const OFFICE_STYLES = {
  pdf: { icon: '📕', color: '#EE3322', bg: 'bg-red-50', label: 'PDF' },
  doc: { icon: '📘', color: '#2B579A', bg: 'bg-blue-50', label: 'Word' },
  docx: { icon: '📘', color: '#2B579A', bg: 'bg-blue-50', label: 'Word' },
  xls: { icon: '📗', color: '#217346', bg: 'bg-green-50', label: 'Excel' },
  xlsx: { icon: '📗', color: '#217346', bg: 'bg-green-50', label: 'Excel' },
  pptx: { icon: '📙', color: '#FF6802', bg: 'bg-orange-50', label: 'PowerPoint' },
  link: { icon: '🔗', color: '#2B579A', bg: 'bg-gray-50', label: 'URL' },
  default: { icon: '📁', color: '#64748b', bg: 'bg-slate-50', label: 'File' }
};

// --- SSO CONFIG ---
// URL Sitio WordPress Interno
const WP_URL = 'https://atlasseniorliving.net/';

export default function App() {
  const [autenticado, setAutenticado] = useState(() => {
    const sesionActiva = localStorage.getItem('atlas_session');
    return sesionActiva === 'true';
  });
  const [ssoLoading, setSsoLoading] = useState(false);


  const [inputPass, setInputPass] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [letraFiltro, setLetraFiltro] = useState('All');
  const [catFiltro, setCatFiltro] = useState('All');
  const [stateFiltro, setStateFiltro] = useState('');
  const [mostrarFavoritos, setMostrarFavoritos] = useState(true);

  // DRAG & DROP STATES
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);



  const [favoritos, setFavoritos] = useState(() => {
    const saved = localStorage.getItem('atlas_favs');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [animatingIds, setAnimatingIds] = useState([]);
  const [drawerGlowing, setDrawerGlowing] = useState(false);
  const [sugOpen, setSugOpen] = useState(false);
  const [sugIndex, setSugIndex] = useState(-1);
  const drawerCountRef = useRef(null);
  const ssoValidatingRef = useRef(false);

  useEffect(() => {
    localStorage.setItem('atlas_favs', JSON.stringify(favoritos));

    const user = JSON.parse(localStorage.getItem('atlas_user') || '{}');
    if (!user?.id) return;

    const timer = setTimeout(() => {
      fetch(`${WP_URL}/wp-json/atlas/v1/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, favorites: favoritos }),
      }).catch(() => { });
    }, 800);

    return () => clearTimeout(timer);
  }, [favoritos]);

  // --- SSO: Verifica token de WordPress en la URL ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Logout desde WordPress
    if (params.get('logout') === 'true') {
      localStorage.removeItem('atlas_session');
      localStorage.removeItem('atlas_user');
      setAutenticado(false);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    const token = params.get('sso_token');

    // Si ya hay sesion activa y no hay token nuevo, verifica con WordPress
    if (!token && autenticado) {
      fetch(`${WP_URL}/wp-json/atlas/v1/sso/check`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(r => r.json())
        .then(data => {
          if (data.logged_in === false) {
            localStorage.removeItem('atlas_session');
            localStorage.removeItem('atlas_user');
            setAutenticado(false);
          }
        })
        .catch(() => { }); // Si falla, mantiene la sesion
      return;
    }

    if (!token || autenticado) return;

    // Evita doble validacion por StrictMode o doble render
    if (ssoValidatingRef.current) return;
    ssoValidatingRef.current = true;

    setSsoLoading(true);

    fetch(`${WP_URL}/wp-json/atlas/v1/sso/validar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.valid) {
          localStorage.setItem('atlas_session', 'true');
          if (data.user) localStorage.setItem('atlas_user', JSON.stringify(data.user));
          setAutenticado(true);
          // Limpia el token de la URL sin recargar la pagina
          window.history.replaceState({}, document.title, window.location.pathname);

          // Load user favorites from WordPress
          if (data.user?.id) {
            fetch(`${WP_URL}/wp-json/atlas/v1/favorites?user_id=${data.user.id}`)
              .then(r => r.json())
              .then(favData => {
                if (favData.favorites?.length) {
                  setFavoritos(favData.favorites);
                  localStorage.setItem('atlas_favs', JSON.stringify(favData.favorites));
                }
              })
              .catch(() => { });
          }
        } else {
          // Token invalido, limpia la URL y muestra login normal
          window.history.replaceState({}, document.title, window.location.pathname);
          ssoValidatingRef.current = false;
        }
      })
      .catch(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
        ssoValidatingRef.current = false;
      })
      .finally(() => setSsoLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stellarBurst = (x, y, opts = {}) => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const size = opts.size ?? 160;
    const durationMs = opts.durationMs ?? 1200;
    const speedScale = opts.speedScale ?? 1;
    const lifeDecay = opts.lifeDecay ?? 0.02;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.left = `${x - size / 2}px`;
    canvas.style.top = `${y - size / 2}px`;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    const ctx = canvas.getContext('2d');
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    document.body.appendChild(canvas);
    const centerX = size / 2;
    const centerY = size / 2;
    const colors = ['#ffffff', '#fde047', '#60a5fa', '#a78bfa', '#22d3ee'];
    const count = 24;
    const particles = [];
    const meteors = [];
    const createPRNG = (seed) => {
      let s = seed >>> 0;
      return () => {
        s = (1664525 * s + 1013904223) >>> 0;
        return (s & 0xfffffff) / 0x10000000;
      };
    };
    const rnd = createPRNG((Math.floor(x * y) ^ count) >>> 0);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2) * (i / count) + rnd() * 0.3;
      const speed = (2.8 + rnd() * 2.2) * speedScale;
      const s = 2 + rnd() * 2;
      const c = colors[Math.floor(rnd() * colors.length)];
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: s,
        spin: (rnd() * 0.1) + 0.05,
        color: c,
        rotation: rnd() * Math.PI
      });
    }
    const meteorCount = 3;
    for (let i = 0; i < meteorCount; i++) {
      const dir = rnd() > 0.5 ? 1 : -1;
      const startX = dir === 1 ? -20 : size + 20;
      const startY = rnd() * size * 0.6 + size * 0.2;
      const speed = (4 + rnd() * 2) * speedScale;
      const angle = (dir === 1 ? 0.25 : 0.75) * Math.PI + rnd() * 0.15 * dir;
      const color = colors[Math.floor(rnd() * colors.length)];
      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        len: 18 + rnd() * 10,
        w: 1.5 + rnd(),
        color
      });
    }
    let start;
    const drawStar = (cx, cy, spikes, outerR, innerR, rot, color, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      const step = Math.PI / spikes;
      for (let i = 0; i < spikes * 2; i++) {
        const rad = i % 2 === 0 ? outerR : innerR;
        const a = i * step;
        const sx = Math.cos(a) * rad;
        const sy = Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    const loop = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      ctx.clearRect(0, 0, size, size);
      for (const p of particles) {
        const omega = 0.045;
        const vx = p.vx;
        const vy = p.vy;
        p.vx = vx * Math.cos(omega) - vy * Math.sin(omega);
        p.vy = vx * Math.sin(omega) + vy * Math.cos(omega);
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.rotation += p.spin;
        p.life -= lifeDecay;
        if (p.life <= 0) continue;
        drawStar(p.x, p.y, 5, p.size + 1.5, p.size, p.rotation, p.color, Math.max(p.life, 0));
        ctx.save();
        ctx.globalAlpha = Math.max(p.life - 0.2, 0);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 2, p.y - p.vy * 2);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.restore();
      }
      for (const m of meteors) {
        m.x += m.vx;
        m.y += m.vy;
        m.life -= lifeDecay;
        if (m.life <= 0) continue;
        const gx = m.x - m.vx * m.len;
        const gy = m.y - m.vy * m.len;
        const grad = ctx.createLinearGradient(gx, gy, m.x, m.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.5, m.color);
        grad.addColorStop(1, 'rgba(255,255,255,0.9)');
        ctx.save();
        ctx.globalAlpha = Math.max(m.life, 0);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.w;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        ctx.restore();
      }
      if (elapsed < durationMs) {
        requestAnimationFrame(loop);
      } else {
        canvas.remove();
      }
    };
    requestAnimationFrame(loop);
  };

  const toggleFavorito = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    const yaEsFavorito = favoritos.includes(id);

    if (!yaEsFavorito) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      stellarBurst(x, y);
      if (drawerCountRef.current) {
        const r = drawerCountRef.current.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        //stellarBurst(cx, cy, { durationMs: 5600, speedScale: 0.8, lifeDecay: 0.016, size: 160 });
      }

      setAnimatingIds(prev => [...prev, id]);
      setDrawerGlowing(true);
      setTimeout(() => {
        setAnimatingIds(prev => prev.filter(itemId => itemId !== id));
        setDrawerGlowing(false);
      }, 800);
      setFavoritos(prev => [...prev, id]);
    } else {
      setFavoritos(prev => prev.filter(favId => favId !== id));
    }
  };

  // --- LÓGICA DE DRAG & DROP ROBUSTA ---
  const handleDragStart = (e, id) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };



  const handleDragOver = (e, index) => {
    e.preventDefault();
    // We allow bubbling so the container can handle auto-scroll!
    // e.stopPropagation(); 

    // --- CALCULATE DROP TARGET ---
    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = (rect.left + rect.right) / 2;

    // If mouse is on right half, target is next index
    let newDropIndex = index;
    if (e.clientX > midpoint) {
      newDropIndex = index + 1;
    }

    if (dropTargetIndex !== newDropIndex) {
      setDropTargetIndex(newDropIndex);
    }
  };



  const handleDrop = (e, targetId) => {
    e.preventDefault();
    e.stopPropagation(); // Stop bubbling to container drop

    if (!draggedItemId || draggedItemId === targetId) {
      setDraggedItemId(null);
      setDropTargetIndex(null);
      return;
    }

    const sourceIndex = favoritos.indexOf(draggedItemId);
    const targetIndex = favoritos.indexOf(targetId);

    if (sourceIndex === -1 || targetIndex === -1) {
      // Fallback or error state
      setDraggedItemId(null);
      setDropTargetIndex(null);
      return;
    }

    // Calculate insertion index
    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = (rect.left + rect.right) / 2;
    const isAfter = e.clientX > midpoint;

    let insertIndex = targetIndex;
    if (isAfter) insertIndex += 1;

    // Adjust for removal
    // If source is before target, removing source shifts target index down by 1?
    // Splice logic:
    // [A, B, C, D]. Move A(0) to after C(2). Target C is at 2. Insert at 3.
    // Remove A -> [B, C, D]. Insert at 3-1 = 2? -> [B, C, A, D]. Correct.

    // [A, B, C, D]. Move D(3) to before B(1). Target B is at 1. Insert at 1.
    // Remove D -> [A, B, C]. Insert at 1. -> [A, D, B, C]. Correct.

    let finalInsertIndex = insertIndex;
    if (sourceIndex < insertIndex) {
      finalInsertIndex -= 1;
    }

    const newFavoritos = [...favoritos];
    const [movedItem] = newFavoritos.splice(sourceIndex, 1);
    newFavoritos.splice(finalInsertIndex, 0, movedItem);

    setFavoritos(newFavoritos);
    setDraggedItemId(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDropTargetIndex(null);
  };



  const getDisplayName = (fileName) => {
    const idx = fileName.lastIndexOf('.');
    if (idx <= 0) return fileName;
    return fileName.slice(0, idx);
  };

  const handleSuggestionSelect = (doc) => {
    setBusqueda(getDisplayName(doc.nombre));
    setSugOpen(false);
  };

  const getFileDetails = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    return OFFICE_STYLES[ext] || OFFICE_STYLES.default;
  };

  const getColorClasses = (dept) => {
    switch (dept) {
      case 'Clinical Policy':
        return {
          active: 'bg-teal-100 text-teal-800 border-teal-300 shadow-teal-100',
          hover: 'hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200'
        };
      case 'Job Description':
        return {
          active: 'bg-purple-100 text-purple-800 border-purple-300 shadow-purple-100',
          hover: 'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200'
        };
      case 'Redirect Link':
        return {
          active: 'bg-gray-50 text-gray-700 border-gray-400 shadow-gray-200',
          hover: 'hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300'
        };
      default:
        return {
          active: 'bg-slate-900 text-white border-slate-900 shadow-slate-300',
          hover: 'hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300'
        };
    }
  };

  const abecedario = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
  const STATES = ['ALABAMA', 'FLORIDA', 'GEORGIA', 'KENTUCKY', 'MARYLAND', 'MISSISSIPPI', 'SOUTH CAROLINA', 'TENNESSEE', 'TEXAS', 'VIRGINIA'];

  const archivosFiltrados = useMemo(() => {
    return DOCUMENTOS.filter(doc => {
      const nombreSinExt = getDisplayName(doc.nombre).toLowerCase();
      const cumpleNombre = nombreSinExt.includes(busqueda.toLowerCase());
      const cumpleLetra = letraFiltro === 'All' || doc.letra === letraFiltro;
      const cumpleCat = catFiltro === 'All' || doc.departamento === catFiltro;
      const cumpleEstado = !stateFiltro
        || (doc.estado && doc.estado === stateFiltro)
        || nombreSinExt.includes(stateFiltro.toLowerCase());
      return cumpleNombre && cumpleLetra && cumpleCat && cumpleEstado;
    });
  }, [busqueda, letraFiltro, catFiltro, stateFiltro]);

  // Use useMemo to prevent unnecessary recalculations, but filter strictly
  const validFavorites = useMemo(() => {
    return favoritos.filter(favId => DOCUMENTOS.some(d => d.id === favId));
  }, [favoritos]);

  const suggestions = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return [];
    return DOCUMENTOS
      .filter(doc => getDisplayName(doc.nombre).toLowerCase().includes(q))
      .slice(0, 6);
  }, [busqueda]);

  const NotificationBadge = ({ tag }) => {
    if (!tag) return null;
    const isNew = tag === "NEW";
    return (
      <span className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider text-white shadow-sm z-20 animate-pulse ${isNew ? 'bg-green-500' : 'bg-blue-500'}`}>
        {tag}
      </span>
    );
  };

  const handleLogin = () => {
    if (inputPass === CONFIG.passwordCorrecto) {
      localStorage.setItem('atlas_session', 'true');
      setAutenticado(true);
    } else {
      alert('Incorrect code');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('atlas_session');
    localStorage.removeItem('atlas_user');
    setAutenticado(false);
  };

  if (ssoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] font-sans antialiased p-4">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🔐</div>
          <p className="text-white font-bold text-lg">Verifying session...</p>
          <p className="text-slate-500 text-sm mt-2">Connecting with your organization account</p>
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] font-sans antialiased p-4">
        <div className="w-full max-w-md p-8 bg-[#16161a] border border-white/10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="inline-block p-4 bg-blue-600/10 rounded-3xl mb-4 border border-blue-500/20 text-4xl">💎</div>
          <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">{CONFIG.nombre}</h2>
          <input
            type="password"
            placeholder="Enter access code"
            className="w-full bg-black/40 border border-white/5 text-white p-5 rounded-2xl mb-6 outline-none text-center tracking-widest focus:border-blue-500/50 transition-all"
            onChange={(e) => setInputPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl transition-all cursor-pointer">Enter Repository</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 font-sans antialiased text-slate-900 flex flex-col justify-between">
      <div className="max-w-[90rem] mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{CONFIG.nombre}</h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">Files synchronized with OneDrive</p>
        </header>

        {/* --- CORTINA DE FAVORITOS --- */}
        <div className="mb-8 animate-appear-softly lg:float-right lg:w-[22rem] lg:ml-6 lg:mb-0">
          <button
            onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
            className="w-full flex items-center justify-between py-2 px-1 hover:bg-slate-100/50 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <Motion.div
                ref={drawerCountRef}
                animate={drawerGlowing ? { scale: 1.3, backgroundColor: "#3b82f6", boxShadow: "0 0 0 4px #bfdbfe" } : { scale: 1, backgroundColor: "#2563eb", boxShadow: "0 0 0 0px transparent" }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className="w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-blue-200"
              >
                {validFavorites.length}
              </Motion.div>
              <Motion.span
                animate={drawerGlowing ? { scale: 1.05, color: "#2563eb", textShadow: "0 0 10px rgba(37,99,235,0.5)" } : { scale: 1, color: "#334155", textShadow: "none" }}
                className="font-bold text-slate-700 text-lg tracking-wide"
              >
                My Favorites
              </Motion.span>
            </div>
            <span className={`text-slate-400 text-xs transform transition-transform duration-300 ${mostrarFavoritos ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          <div className={`transition-opacity duration-500 ease-in-out ${mostrarFavoritos ? 'opacity-100' : 'opacity-0 hidden'}`}>

            <div className="py-4 px-2">
              <div
                className="grid grid-cols-1 gap-3 pt-3"
              >

                {/* --- MAPEO DE FAVORITOS (DRAGGABLE) --- */}
                {validFavorites.map((favId, index) => {
                  const doc = DOCUMENTOS.find(d => d.id === favId);
                  if (!doc) return null;
                  const style = getFileDetails(doc.nombre);
                  const deptColors = getColorClasses(doc.departamento);

                  const isDraggedItem = draggedItemId === doc.id;
                  const draggedVisualIndex = validFavorites.indexOf(draggedItemId);

                  return (
                    <div
                      key={doc.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, doc.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, doc.id)}
                      className={`
                            w-full
                            bg-gradient-to-br from-white/60 to-white/30 border border-white/60 
                            text-slate-800 p-4 rounded-2xl transition-all relative group flex flex-col justify-between 
                            min-h-[120px] h-auto hover:bg-white/50 
                            cursor-grab active:cursor-grabbing
                            ${isDraggedItem ? 'opacity-40 border-blue-400 border-dashed scale-95' : ''}
                        `}
                    >
                      {/* --- LÍNEA GUÍA DE DROP (DROP INDICATOR) --- */}
                      {dropTargetIndex !== null &&
                        !isDraggedItem &&
                        dropTargetIndex !== draggedVisualIndex &&
                        dropTargetIndex !== draggedVisualIndex + 1 && (
                          <>
                            {dropTargetIndex === index && (
                              <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-50 shadow-[0_0_10px_rgba(59,130,246,0.8)] pointer-events-none animate-pulse h-full scale-y-90 origin-center" />
                            )}
                            {index === validFavorites.length - 1 && dropTargetIndex === index + 1 && (
                              <div className="absolute -right-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-50 shadow-[0_0_10px_rgba(59,130,246,0.8)] pointer-events-none animate-pulse h-full scale-y-90 origin-center" />
                            )}
                          </>
                        )}

                      <NotificationBadge tag={doc.tag} />

                      {/* 6 PUNTOS (DRAG HANDLE) */}
                      <div className="absolute top-2 left-2 text-slate-400/50 group-hover:text-slate-400 transition-colors pointer-events-none">
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor">
                          <circle cx="2" cy="2" r="1.5" /><circle cx="2" cy="6" r="1.5" /><circle cx="2" cy="10" r="1.5" />
                          <circle cx="6" cy="2" r="1.5" /><circle cx="6" cy="6" r="1.5" /><circle cx="6" cy="10" r="1.5" />
                        </svg>
                      </div>

                      <button onClick={(e) => toggleFavorito(e, doc.id)} className="absolute top-3 right-3 text-yellow-400 text-lg z-20 cursor-pointer hover:scale-110 transition-transform drop-shadow-sm">★</button>

                      <div className="flex items-start gap-2 mt-4 pointer-events-none select-none">
                        <span className="text-xl drop-shadow-sm">{style.icon}</span>
                        <div className="min-w-0">
                          {doc.departamento && (
                            <span className={`text-[6px] font-bold px-1.5 py-0.5 rounded-md border mb-1 inline-block whitespace-nowrap ${deptColors.active}`}>
                              {doc.departamento}
                            </span>
                          )}
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block leading-none">{style.label}</span>
                        </div>
                      </div>

                      <div className="pointer-events-none select-none">
                        <h3 className="font-bold text-xs leading-tight mb-2 pr-2 opacity-90 text-slate-800 break-words">{getDisplayName(doc.nombre)}</h3>
                        <div className="pointer-events-auto">
                          <a href={doc.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 font-bold hover:text-blue-500 transition-colors flex items-center gap-1 cursor-pointer">Open Link <span>→</span></a>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {validFavorites.length === 0 && (
                  <div className="w-full min-h-[120px] flex items-center justify-center text-slate-600 text-xs opacity-90">Click ★ to pin files here</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- PESTAÑAS DE DEPARTAMENTOS --- */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIAS.map(cat => {
            const colors = getColorClasses(cat);
            const isActive = catFiltro === cat;
            return (
              <button
                key={cat}
                onClick={() => { setCatFiltro(cat); setLetraFiltro('All'); }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${isActive
                  ? `${colors.active} shadow-md scale-105`
                  : `bg-white text-slate-500 border-slate-200 ${colors.hover}`
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* --- BUSCADOR --- */}
        <div className="relative mb-6 flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by file name..."
              value={busqueda}
              className="w-full pl-6 pr-6 py-4 bg-white rounded-2xl shadow-sm border border-slate-200 outline-none text-md focus:ring-2 focus:ring-blue-500/20 transition-all"
              onChange={(e) => { setBusqueda(e.target.value); setSugIndex(-1); setSugOpen(true); }}
              onFocus={() => setSugOpen(true)}
              onBlur={() => setTimeout(() => setSugOpen(false), 100)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setSugOpen(true);
                  setSugIndex(i => Math.min(i + 1, suggestions.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setSugOpen(true);
                  setSugIndex(i => Math.max(i - 1, 0));
                } else if (e.key === 'Enter') {
                  if (sugIndex >= 0 && suggestions[sugIndex]) {
                    e.preventDefault();
                    handleSuggestionSelect(suggestions[sugIndex]);
                  }
                } else if (e.key === 'Escape') {
                  setSugOpen(false);
                }
              }}
            />
            {sugOpen && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {suggestions.map((doc, idx) => {
                  const style = getFileDetails(doc.nombre);
                  const active = idx === sugIndex;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionSelect(doc)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left ${active ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'}`}
                    >
                      <div className={`w-6 h-6 ${style.bg} rounded-md flex items-center justify-center border border-slate-100`}>
                        <span className="text-sm">{style.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate">{getDisplayName(doc.nombre)}</span>
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{style.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {(busqueda || letraFiltro !== 'All' || catFiltro !== 'All' || stateFiltro) && (
            <button onClick={() => { setBusqueda(''); setLetraFiltro('All'); setCatFiltro('All'); setStateFiltro(''); }} className="bg-red-50 text-red-500 px-6 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all cursor-pointer">Clear</button>
          )}
        </div>

        {/* --- SELECTOR DE LETRAS --- */}
        <div className="flex overflow-x-auto gap-1.5 pb-2 mb-6 no-scrollbar scroll-smooth">
          <div className="flex flex-nowrap md:flex-wrap gap-1.5 min-w-max md:min-w-full justify-start md:justify-center">
            {abecedario.map(l => (
              <button key={l} onClick={() => setLetraFiltro(l)} className={`w-8 h-8 flex-shrink-0 rounded-lg font-bold transition-all text-xs cursor-pointer ${letraFiltro === l ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-400 hover:bg-slate-100 border border-slate-100'}`}>{l}</button>
            ))}
          </div>
        </div>

        {/* --- CATEGORÍAS POR ESTADO --- */}
        <div className="flex flex-wrap gap-1.5 mb-6 justify-center">
          {STATES.map(st => {
            const active = stateFiltro === st;
            return (
              <button
                key={st}
                onClick={() => setStateFiltro(prev => (prev === st ? '' : st))}
                className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer border ${active
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
              >
                {st}
              </button>
            );
          })}
        </div>

        {/* --- REPOSITORIO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
          {archivosFiltrados.map(doc => {
            const style = getFileDetails(doc.nombre);
            const isFav = favoritos.includes(doc.id);
            const isAnimating = animatingIds.includes(doc.id);
            const colors = getColorClasses(doc.departamento);

            return (
              <div key={doc.id} className="group bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-md cursor-pointer  hover:border-blue-200 transition-all duration-300 relative overflow-visible z-0 hover:z-10">
                <NotificationBadge tag={doc.tag} />

                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 ${style.bg} rounded-xl flex-shrink-0 flex items-center justify-center border border-slate-50 group-hover:scale-105 transition-transform`}>
                    <span className="text-xl">{style.icon}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[8px] font-black uppercase tracking-wider" style={{ color: style.color }}>{style.label}</p>
                      {doc.departamento && (
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md border ${colors.active}`}>
                          {doc.departamento}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 text-xs pr-1 group-hover:text-blue-600 transition-colors break-words">
                      {getDisplayName(doc.nombre)}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-2">
                  <div className="relative flex items-center justify-center w-8 h-8">
                    <Motion.button
                      onClick={(e) => toggleFavorito(e, doc.id)}
                      className="text-lg cursor-pointer z-10 flex items-center justify-center outline-none"
                      initial={false}
                      animate={{
                        scale: isAnimating ? [1, 1.5, 1] : 1,
                        color: isFav ? "#fbbf24" : "#e2e8f0"
                      }}
                      whileHover={{ scale: 1.2, color: isFav ? "#fbbf24" : "#fcd34d" }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      {isFav ? '★' : '☆'}
                    </Motion.button>
                  </div>

                  <a href={doc.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-400 font-bold text-[9px] uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                    Open
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {archivosFiltrados.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-3 opacity-20">📂</div>
            <p className="text-slate-400 text-sm font-medium">No files found for this filter</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="max-w-[90rem] mx-auto w-full mt-20 border-t border-slate-200 py-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-slate-400 text-xs font-bold">© {new Date().getFullYear()} {CONFIG.nombre}</p>
        </div>
        <div className="flex gap-6">
          <a href={`mailto:${CONFIG.emailSoporte}`} className="invisible text-slate-400 hover:text-blue-600 text-xs font-bold py-1.5 transition-colors">Report Issue</a>
          <button onClick={handleLogout} className="invisible text-slate-400 hover:text-gray-600 text-xs bg-black text-white px-4 py-1.5 rounded-lg cursor-pointer font-bold transition-colors">Logout</button>
        </div>
      </footer>

      {/* --- ESTILOS DE ANIMACIÓN --- */}
      <style jsx>{`
        /* Nueva animación de entrada suave para el contenedor de favoritos */
        @keyframes appear-softly {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-appear-softly {
            animation: appear-softly 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            overflow: visible; 
        }
      `}</style>
    </div>
  );
}
