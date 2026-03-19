import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion as Motion } from 'framer-motion';

const CONFIG = {
  nombre: "Atlas Senior Living Forms Hub",
  passwordCorrecto: "Atlas2026",
  emailSoporte: "grosales@atlasseniorliving.com",
  version: "1.4.4" // Update: Drag & Drop Fixed & Robust
};

// --- BASE DE DATOS ---
const DOCUMENTOS = [
  { id: 40, nombre: "Workplace Violence Policy.docx", letra: "W", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBuHkCD07-UTo9b6Y1sziOvASvkbqUh6s0cIzNZgXrAOfE?e=EHgOCY", departamento: "Clinical Policy" },
  { id: 50, nombre: "Work Injury Reporting.docx", letra: "W", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDK_WdNU7I0QqXQUM7yqVsrAVJY5Daj43iQn1qFCnyclwY?e=6qgcG1", departamento: "Clinical Policy" },
  { id: 60, nombre: "Alexa Speak2 Codes.pdf", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:b:/p/grosales/IQBmWkt2raozRa4402TYpvtqAQETVbEw32trr2Ch6dstAwM?e=SdiFCJ", departamento: "" },
  { id: 70, nombre: "Atlas Levels of Care.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDxCI4iiAO8Qb1xU5cTZtjyAdzUl9c8q8EJ4agxDOuteKM?e=ZRFmh8", departamento: "" },
  { id: 92, nombre: "Grievance.docx", letra: "G", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDQLRCejcLMSrOOH_iEUIH0AYcGIivVgxaXu66Pce9sxoY?e=S7BtmP", departamento: "Clinical Policy" },
  { id: 93, nombre: "Reportable Events.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBpBiQKpebRTIyiFc99cSY3AS2Z5CzmrAN3N1-wncwMBMg?e=2jif8e", departamento: "Clinical Policy" },
  { id: 94, nombre: "Resident Refusals.docx", letra: "R", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAfsGQuGES-Spia4J0wXmpvAb98LEbcFAZdD7NxoNCx-Z8?e=kB3Kqs", departamento: "" },
  { id: 95, nombre: "Alexa Speak2 Consent Form.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCOVTG_FDn4TrjjahGgY0rpAR16fnGe5uKsG5YsaJtxRYQ?e=NX1bmN", departamento: "" },
  { id: 96, nombre: "ADL Care Plan.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAndTq7qaihQrFMQxPf5C7hAXN8RjWuv-tYMcjhS7UGsOA?e=9bBX4S", departamento: "Clinical Policy" },
  { id: 97, nombre: "Alexa Speak2 Policy.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBcorH_s71_TJDa64cOxQCkAX3xnkvbkSBs8myy5oi22Q4?e=WBM2w9", departamento: "Clinical Policy" },
  { id: 98, nombre: "Approved Assitance Device.docx", letra: "A", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAlImmRLolSRob8pwuV-ql8AROaN-MiZdL2uiHcqSG_UCU?e=8GZvPu", departamento: "Clinical Policy" },
  { id: 99, nombre: "Care Plan Review.docx", letra: "C", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCzLPHFdLjvQ4tXm3yXhu4DAYg6ZmPIbvkIb0bhygzkl28?e=ResSF2", departamento: "Clinical Policy" },
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
  { id: 137, nombre: "Atlas Speak 2 Codes.pdf", letra: "A", link: "https://atlasseniorliving.net/wp-content/uploads/2025/06/Atlas-Speak2-codes-leaving-apartment-_compressed.pdf", departamento: "" },
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
  { id: 153, nombre: "Care Plan Review.docx", letra: "C", link: "https://atlasseniorliving.net/wp-content/uploads/2025/09/Care-Plan-Review-1.docx", departamento: "Clinical Policy" },
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
  { id: 194, nombre: "Denial Process Admissions.docx", letra: "D", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQB1Wqxuj8nSTZZbt1vxp5ggAaOT6FspdXl0rXH9A55npvs?e=4CR0Hd", departamento: "Clinical Policy" },
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
  { id: 217, nombre: "Electronic Monitoring Sign.pdf", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Electronic-Monitoring-Sign-_Resident-Door_1.pdf", departamento: "" },
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
  { id: 235, nombre: "Environmental Surfaces.docx", letra: "E", link: "https://atlasseniorliving.net/wp-content/uploads/2026/02/Environmental-surfaces.docx", departamento: "" },
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
  { id: 247, nombre: "Fax Physician Form.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDHVqNxl0RVSLhdbGYgHuRjASwv7wkeSb9iYHcMthxWT6k?e=Qcg9On", departamento: "" },
  { id: 248, nombre: "Fit Test Checklist.docx", letra: "F", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Fit-test-checklist-04142022.docx", departamento: "" },
  { id: 249, nombre: "Fire Watch Log.docx", letra: "F", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Fire-Watch-Log.docx", departamento: "" },
  { id: 250, nombre: "Final PCC Binder.pdf", letra: "F", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Final-Final-PCC-binder-4.pdf", departamento: "Clinical Policy" },
  { id: 251, nombre: "Fingernail Policy.docx", letra: "F", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/fingernail-policy.docx", departamento: "Clinical Policy" },
  { id: 252, nombre: "Fire Drill Form.docx", letra: "F", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCkKQJsKO2LRLPzBwo_vSeYAQLNeJ8ZcxUtzBB0fq0sAmo?e=4auaKI", departamento: "Clinical Policy" },
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
  { id: 264, nombre: "Grievance.docx", letra: "G", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDQLRCejcLMSrOOH_iEUIH0AYcGIivVgxaXu66Pce9sxoY?e=S7BtmP", departamento: "Clinical Policy" },
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
  { id: 277, nombre: "Housekeeping & Laundry.docx", letra: "H", link: "https://atlasseniorliving.net/wp-content/uploads/2024/12/Housekeeping-and-Laundry-Policy.docx", departamento: "Clinical Policy" },
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
  { id: 298, nombre: "Refrigerator Log Kitchen.xlsx", letra: "K", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Beverage-fridge.xlsx", departamento: "" },
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
  { id: 317, nombre: "Maintenance Policy.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/12/Maintenance-Policy.docx", departamento: "" },
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
  { id: 331, nombre: "Medical Marijuana.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAI975UmUshRJ7BXqsLZFMWAWd_JRYdGM5QPm7Cjfk-T54?e=xpjXwk", departamento: "Clinical Policy" },
  { id: 332, nombre: "Medication Administration.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBQ-9OtZOOQS5ZFglEZE1fSAQrGnLfo8ULQd5Qi13iiwjg?e=7dwYk7", departamento: "Clinical Policy" },
  { id: 333, nombre: "Medication Disposal.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:b:/p/grosales/IQApS7pB9s4jRr2djGHEjLAPAf23NAlA_dm4UaBA1HzS_U0?e=HDWSUC", departamento: "Clinical Policy" },
  { id: 334, nombre: "Medication Documentation.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQC_pXZwvwHuTodZngYvxuf3AbRgqmD8674mnpiVYOgJKoo?e=EPb4En", departamento: "Clinical Policy" },
  { id: 335, nombre: "Medication Error.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBfgUGCR6reSbKAvB_hUj5YAZQ_lHNUt19NBjlFTe9cHvc?e=PkEc8n", departamento: "Clinical Policy" },
  { id: 336, nombre: "Medication Order Confirmation.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCpMdHvoa8fTrEggBG9rxGtAc7U8qP6ppQzzEvXrDS71A8?e=Qe81BH", departamento: "Clinical Policy" },
  { id: 337, nombre: "Medication Packaging.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Medication-Packaging-Policy.docx", departamento: "Clinical Policy" },
  { id: 338, nombre: "Medication Refusals.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQB13P4wITiWRb3y9Qc-eS-sARGXFIWR2Bq73VBCcPLgp7Y?e=S557BP", departamento: "Clinical Policy" },
  { id: 339, nombre: "Medication Release.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAcd8dN52IsQKrPv4RisF0VAW2ON3Gv9UMGdbQ-020BwfY?e=1H8H5K", departamento: "Clinical Policy" },
  { id: 340, nombre: "Medication Reorder Hold.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCb8S-ZEXbGTqu3CetkbiSmAZK0KHUvHQC1EIqcqF7AwzQ?e=NzD3fl", departamento: "Clinical Policy" },
  { id: 341, nombre: "Medication Treatment Guidelines.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQCHgIFKkI93Tb9sVoaReIfQASHJCvp5kOrIJ3Y_sSAzX5c?e=2c1YtP", departamento: "Clinical Policy" },
  { id: 342, nombre: "Medication Self-Administration.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQASsKeOOjiySaOPkiCbJa07AaZR-S6sSjnBLJOC7XBmMIo?e=OvlZOS", departamento: "Clinical Policy" },
  { id: 343, nombre: "Memory Care Admission Policy.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQBugSqSQkhuTrQaeCzfQ86tAbncfmA1tJbwbk9xQ843ePM?e=QfBPyj", departamento: "Clinical Policy" },
  { id: 344, nombre: "Memory Care Director.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Memory-Care-Coordinator.docxj", departamento: "Job Description" },
  { id: 345, nombre: "Missed Time Punch.pdf", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Missing-Time-Punch-Form.pdf", departamento: "" },
  { id: 346, nombre: "Missing Resident.docx", letra: "M", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQAGTEJQdZWtRKerkYaaxrwNAYl13j-xu4xAnEr_Gt0XkCQ?e=fmP0qx", departamento: "Clinical Policy" },
  { id: 347, nombre: "Monthly Quality Assurance.pdf", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Quality-Assurance-Policy.docx", departamento: "" },
  { id: 348, nombre: "Monkeypox.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Monkeypox-Policy.docx", departamento: "Clinical Policy" },
  { id: 349, nombre: "Motorized Wheelchair.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Motorized-Wheelchair-Policy.docx", departamento: "Clinical Policy" },
  { id: 350, nombre: "Move In Coordinator.docx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Move-In-Coordinator.docx", departamento: "Job Description" },
  { id: 351, nombre: "Move In Rent Level of Care Form.pdf", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/11/Two-Page-Atlas-Level-of-Care-Move-In-Rent-Editable-6.pdf", departamento: "" },
  { id: 352, nombre: "Move In Satisfaction Checklist.xlsx", letra: "M", link: "https://atlasseniorliving.net/wp-content/uploads/2025/04/Move-in-Process.xlsx", departamento: "" },
  // N
  { id: 353, nombre: "Narcotic Blank Sheet.pdf", letra: "N", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Blank-Narcotic-Sheet.pdf", departamento: "" },
  { id: 354, nombre: "New Hire Packet Final.docx", letra: "N", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/New-Hire-Packet-Final.docx", departamento: "" },
  { id: 355, nombre: "New Prospect Form.pdf", letra: "N", link: "https://atlasseniorliving.net/wp-content/uploads/2024/01/New-Prospect-Form.pdf", departamento: "" },
  { id: 356, nombre: "New Prospect Form.pdf", letra: "N", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/New-Residents-Notification.pdf", departamento: "" },
  { id: 357, nombre: "Negotiated Risk Agreement.docx", letra: "N", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Negotiated-Risk-Agreement-Policy.docx", departamento: "Clinical Policy" },
  { id: 358, nombre: "Nurses Notes.docx", letra: "N", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Nurses-Notes-Policy-1.docx", departamento: "Clinical Policy" },
  // O
  { id: 359, nombre: "Offer Letter.docx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Atlas-Offer-letter.docx", departamento: "" },
  { id: 360, nombre: "Operations Standards 2025.xlsx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2025/08/Atlas-Standards-2025.xlsx", departamento: "" },
  { id: 361, nombre: "Open Close Daily.xlsx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Open-close-daily.xlsx", departamento: "" },
  { id: 362, nombre: "Orientation Certificate.docx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/Orientation-Certificate.docx", departamento: "" },
  { id: 363, nombre: "Ordering & Receipt of Medication.docx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Ordering-and-Receipt-of-Medication-Policy.docx", departamento: "Clinical Policy" },
  { id: 364, nombre: "Orientation New Wellness Director.docx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Orientation-New-Wellness-Director-8.26.22.docx", departamento: "" },
  { id: 365, nombre: "OSHA COVID-19.docx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/OSHA-COVID-policy.docx", departamento: "Clinical Policy" },
  { id: 366, nombre: "Out of Service Signage.docx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Out-of-Service-Signage.docx", departamento: "" },
  { id: 367, nombre: "Oxygen Theraphy Safe.docx", letra: "O", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Policy-Oxygen-Therapy-Safe-Handling-and-Storage-of-Oxygen.docx", departamento: "Clinical Policy" },
  // P
  { id: 368, nombre: "Pain Management.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Pain-Management-Policy-2.docx", departamento: "Clinical Policy" },
  { id: 369, nombre: "Palliative Care.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Palliative-Care-Policy.docx", departamento: "Clinical Policy" },
  { id: 370, nombre: "Pandemic Comitee.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Pandemic-Committee-Policy.docx", departamento: "Clinical Policy" },
  { id: 371, nombre: "Payactive Flyer.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/Payactiv-AccessFlyer-WithCard.pdf", departamento: "" },
  { id: 372, nombre: "Paychex Support Team.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2022/11/Paychex-Support-Team-Contacts.pdf", departamento: "" },
  { id: 373, nombre: "Pet Agreement.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/10/Pet-Agreement-WORD-DOC.docx", departamento: "" },
  { id: 374, nombre: "Personal Belongings.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/04/Personal-Belongings-Form.pdf", departamento: "" },
  { id: 375, nombre: "Personal Care Items.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Personal-Care-Items-Memory-Care-Policy.docx", departamento: "Clinical Policy" },
  { id: 376, nombre: "Personal Protective Equip.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Personal-Protective-Equipment.docx", departamento: "Clinical Policy" },
  { id: 377, nombre: "Personal Possesions Policy.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Personal-Possessions-Policy.docx", departamento: "Clinical Policy" },
  { id: 378, nombre: "Pets in the Community.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Pets-in-the-Community-Policy.docx", departamento: "Clinical Policy" },
  { id: 379, nombre: "Physical Examination.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Physical-Examination-Policy.docx", departamento: "Clinical Policy" },
  { id: 380, nombre: "Physician Forms.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Atlas-Phyician-Forms-.pdf-pool-alcohol-version.pdf", departamento: "" },
  { id: 381, nombre: "Physician Orders.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Physician-Orders-Policy.docx", departamento: "Clinical Policy" },
  { id: 382, nombre: "Preventing Transmission Inf.docx", letra: "P", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDUV5HGGyjVTKMDX5nxG0gQAVA7Ie1h8DGO-4kPe0M8MwU?e=xajiOF", departamento: "Clinical Policy" },
  { id: 383, nombre: "Point Click Care Guidance.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Point-Click-Care-Guidance.docx", departamento: "" },
  { id: 384, nombre: "Point Click User Manual.link", letra: "P", link: "https://drive.google.com/file/d/1F_2vnb4YSnPiVcIp5Ezf1v23oej3QIOY/view?usp=sharing", departamento: "Redirect Link" },
  { id: 385, nombre: "Policy Review Check Off.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/Policy-Review-Check-Off.docx", departamento: "" },
  { id: 386, nombre: "Policy Oxygen Therapy.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Policy-Oxygen-Therapy-Safe-Handling-and-Storage-of-Oxygen.docx", departamento: "Clinical Policy" },
  { id: 387, nombre: "POLST.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/POLST.pdf", departamento: "" },
  { id: 388, nombre: "Preventative Maintenance.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Property-Damage-Form-1.docx", departamento: "" },
  { id: 389, nombre: "Property Damage.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Property-Damage-Form-1.docx", departamento: "" },
  { id: 390, nombre: "Proxy Med Pass.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Proxy-med-pass-policy.docx", departamento: "Clinical Policy" },
  { id: 391, nombre: "Proxy Orientation Training Packet.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/10/Proxy-Orientation-training-packet.pdf", departamento: "" },
  { id: 392, nombre: "Power Failure and Water Disruption.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/02/Power-failure-and-water-failure-AL-Policy.docx", departamento: "" },
  { id: 393, nombre: "Private Sitters Policy and Proced.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/10/Private-sitters-policy-and-Procedure-.docx", departamento: "Clinical Policy" },
  { id: 394, nombre: "Psycotropic Review.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Psychotropic-Review-Policy.docx", departamento: "Clinical Policy" },
  { id: 395, nombre: "Pulse Ox Policy.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Pulse-Ox-Policy.docx", departamento: "Clinical Policy" },
  { id: 396, nombre: "PTO Donation Policy.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/PTO-Donation-Form-Need-just-page-2.pdf", departamento: "" },
  { id: 397, nombre: "PTO Donation Form.pdf", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/07/Atlas-PTO-Donation-Form-2024.pdf", departamento: "" },
  { id: 398, nombre: "Peer Team Contact Info Ignite Training.docx", letra: "P", link: "https://atlasseniorliving.net/wp-content/uploads/2025/06/Peer-team-contact-Info-Ignite-Training92.docx", departamento: "Clinical Policy" },
  // Q
  { id: 399, nombre: "Quality Assurance.docx", letra: "Q", link: "https://atlasseniorliving-my.sharepoint.com/:w:/p/grosales/IQDqhc54x5E-QYbroO7USy3aAcXFBpCTkqW9sdvOMrg2O60?e=SKeML0", departamento: "Clinical Policy" },
  { id: 400, nombre: "Questions Support Team.pdf", letra: "Q", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Community-Support-Questions.pdf", departamento: "" },
  // R
  { id: 401, nombre: "Radar Report.xlsx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2025/08/Radar-Report-Updated-2025.xlsx", departamento: "Clinical Policy" },
  { id: 402, nombre: "Ready for Company Checklist.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/New-Format-Ready-for-Company-Checklist.docx", departamento: "" },
  { id: 403, nombre: "RedEApp Flyer.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/RedEApp-Flyer.pdf", departamento: "" },
  { id: 404, nombre: "Refusal of Services Policy.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2026/02/Refusal-of-Services-Policy.docx", departamento: "Clinical Policy" },
  { id: 405, nombre: "Registered Nurse (RN).docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Registered-Nurse-RN.docx", departamento: "Job Description" },
  { id: 406, nombre: "Release of Deceased Resident.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Release-of-Deceased-Resident-to-Funeral-Director.pdf", departamento: "" },
  { id: 407, nombre: "Release of Medication.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Medication-Release-Policy25.docx", departamento: "Clinical Policy" },
  { id: 408, nombre: "Release Record.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Authorization-For-Release-of-Resident-Records.pdf", departamento: "" },
  { id: 409, nombre: "Rent Cafe Flyer.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2024/10/Rent-Cafe-Flyer.pdf", departamento: "" },
  { id: 410, nombre: "Rent Ready Checklist.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/Atlas_-_Rent_Ready_Checklist.pdf", departamento: "" },
  { id: 411, nombre: "Reportable Events.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2025/08/Reportable-Events-Policy-1.pdf", departamento: "Clinical Policy" },
  { id: 412, nombre: "Resident Care Coordinator.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2026/02/Resident-Care-Coordinator.docx", departamento: "Clinical Policy" },
  { id: 413, nombre: "Resident Council Concern Response.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2024/08/Resident-Council-Concern-Response-Form.docx", departamento: "" },
  { id: 414, nombre: "Resident Council Meetings.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Resident-Council-Meetings-Policy.docx", departamento: "Clinical Policy" },
  { id: 415, nombre: "Resident Council Minutes.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/New-Format-Resident-Council-Minutes-Outline.docx", departamento: "" },
  { id: 416, nombre: "Resident Pre-Admission.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2023/03/Pre-Admission-Assessment-Revised-3.29.23.pdf", departamento: "Clinical Policy" },
  { id: 417, nombre: "Resident Refusal.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/ResidentRefusalForm.pdf", departamento: "" },
  { id: 418, nombre: "Resident Rights.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/RESIDENT-RIGHTS.docx", departamento: "Clinical Policy" },
  { id: 419, nombre: "Resident at Risk P&P.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Resident-at-Risk-PP.pdf", departamento: "Clinical Policy" },
  { id: 526, nombre: "Resident & Guest Sign In.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Resident-and-Guest-Sign-In-Sign-Out-Policy.docx", departamento: "Clinical Policy" },
  { id: 420, nombre: "Respite Move In Form.pdf", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Move-In-Form-Respite.pdf", departamento: "" },
  { id: 421, nombre: "Restraints & Bed Rail Use.docx", letra: "R", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Restraints-and-bed-rail-use-Policy-.docx", departamento: "Clinical Policy" },
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
  { id: 432, nombre: "Scabies Policy.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Scabies-Policy44.docx", departamento: "Clinical Policy" },
  { id: 433, nombre: "Self Administering Medications.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Medication-Self-Administration-Policy.docx", departamento: "Clinical Policy" },
  { id: 434, nombre: "Schedule Availability.pdf", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2024/03/Schedule-Availability.pdf", departamento: "" },
  { id: 435, nombre: "Server.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/08/Server-Job-Description.docx", departamento: "Job Description" },
  { id: 436, nombre: "Sex Offender Registry.pdf", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Sex-Offender-Registry-Policy-.pdf", departamento: "Clinical Policy" },
  { id: 437, nombre: "Sharps Exposure.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Sharps-Exposure-Policy.docx", departamento: "Clinical Policy" },
  { id: 438, nombre: "Shift Report.pdf", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Shift-report-policy.pdf", departamento: "Clinical Policy" },
  { id: 439, nombre: "Shingles Policy & Procedure.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Shingles-Policy-and-Procedure.docx", departamento: "Clinical Policy" },
  { id: 440, nombre: "Shoe Policy.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Atlas-Shoe-Policy.docx", departamento: "" },
  { id: 441, nombre: "Skin Integrity.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Skin-Integrity-Policy.docx", departamento: "Clinical Policy" },
  { id: 442, nombre: "Smoking.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Smoking-Policy.docx", departamento: "Clinical Policy" },
  { id: 443, nombre: "Smoke Free Environment.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Smoke-Free-Environment-Policy.docx", departamento: "Clinical Policy" },
  { id: 444, nombre: "Sous Chef.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Sous-Chef.docx", departamento: "Job Description" },
  { id: 445, nombre: "SPIRIT Activity Assesment.pdf", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Atlas_Spirit-Activity-Assessment_Flyer.pdf", departamento: "" },
  { id: 446, nombre: "SPIRIT Bingo Activities.xlsx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Spirit_Bingo-Activities.xlsx", departamento: "" },
  { id: 447, nombre: "SPIRIT Indiviualized Activities.pdf", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/05/Atlas_Spirit-Indivdualized-Activities_Flyer-.pdf", departamento: "" },
  { id: 448, nombre: "SPIRIT MC Care Standards.xlsx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2024/09/Atlas-SPIRIT-Standards-2024.xlsx", departamento: "" },
  { id: 449, nombre: "SPIRIT Program Flyer.pdf", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2023/02/Atlas_Spirit_Program_Flyer_Hi-Res.pdf", departamento: "" },
  { id: 450, nombre: "SPIRIT 5 Dimensions of Wellness.pdf", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2024/09/SPIRIT_Academy_Component.pdf", departamento: "" },
  { id: 451, nombre: "Staffing.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Staffing-Policy.docx", departamento: "Clinical Policy" },
  { id: 452, nombre: "Staff Education and Monitoring Infection Control.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2026/02/staff-education-and-monitoring-infection-control.docx", departamento: "Clinical Policy" },
  { id: 453, nombre: "Standard Precautions.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2026/02/Standard-Precautions.docx", departamento: "Clinical Policy" },
  { id: 454, nombre: "Storage of Medications.docx", letra: "S", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Storage-of-Medications-Policy-1.docx", departamento: "Clinical Policy" },
  // T
  { id: 455, nombre: "Transmission Based Precautions Inf Control.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2026/02/Transmission-based-precautions-inf-control.docx", departamento: "" },
  { id: 456, nombre: "Team Building Ice Breaker Questions.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2025/06/Team-Building-Ice-Breaker-Questions22.docx", departamento: "" },
  { id: 457, nombre: "Telephone Reference Check.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/Telephone-Reference-Check.docx", departamento: "" },
  { id: 458, nombre: "Temp Log.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Temp-Log-2024.docx", departamento: "Clinical Policy" },
  { id: 459, nombre: "Termination.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2022/12/Termination-Form.docx", departamento: "" },
  { id: 460, nombre: "The Work Number Cover.pdf", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2023/03/7904Letter_Cover_TheWorkNumber.pdf", departamento: "" },
  { id: 461, nombre: "The Work Number (Employee).pdf", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2023/03/7904Flyer_TheWorkNumber_Employee.pdf", departamento: "" },
  { id: 462, nombre: "The Work Number (Requester).pdf", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2023/03/7904Flyer_TheWorkNumber_Requester.pdf", departamento: "" },
  { id: 463, nombre: "Therapeutic Activities.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Therapeutic-Activities-Policy-.docx", departamento: "Clinical Policy" },
  { id: 464, nombre: "Third Party Provider.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Third-Party-Provider-Policy.docx", departamento: "Clinical Policy" },
  { id: 465, nombre: "Time Sheet Form.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2022/07/Atlas_Time-Sheet.doc", departamento: "" },
  { id: 466, nombre: "Time Card Adjustment Form.pdf", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2025/06/Atlas-Timecard-Adjustment-Form.pdf", departamento: "" },
  { id: 467, nombre: "Training Checklist.pdf", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Training-Checklist.pdf", departamento: "" },
  { id: 468, nombre: "Training Sign In Sheet.pdf", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2022/09/Training-Sign-In-Sheet.pdf", departamento: "" },
  { id: 469, nombre: "Transportation Services.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Transportation-Services-Policy.docx", departamento: "Clinical Policy" },
  { id: 470, nombre: "Tornado Policy.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Tornado-Drill-Policy.docx", departamento: "Clinical Policy" },
  { id: 471, nombre: "Tuberculosis.docx", letra: "T", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Tuberculosis-Policy.docx", departamento: "Clinical Policy" },
  // U
  { id: 472, nombre: "Use of Bed Rails.docx", letra: "U", link: "https://atlasseniorliving.net/wp-content/uploads/2025/09/40-Bed-railsdme.docx", departamento: "" },
  { id: 473, nombre: "Use of Restraints.docx", letra: "U", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Use-of-Restraints-Policy.docx", departamento: "Clinical Policy" },
  { id: 474, nombre: "Unlocked Clinical Standards.xlsx", letra: "U", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Unlocked-Clinical-Atlas-Standards.xlsx", departamento: "Clinical Policy" },
  { id: 475, nombre: "UTO Unit Turn Request.docx", letra: "U", link: "https://atlasseniorliving.net/wp-content/uploads/2022/10/UTO-Unit-Turn-Request.doc", departamento: "" },
  // V
  { id: 476, nombre: "Vaccination.docx", letra: "V", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Vaccination-Policy04132022.docx", departamento: "Clinical Policy" },
  { id: 477, nombre: "VA Residency Addendum.docx", letra: "V", link: "https://www.atlasseniorliving.net/wp-content/uploads/2022/02/va_addendum_1.docx", departamento: "" },
  { id: 478, nombre: "Video Surveillance.docx", letra: "V", link: "https://atlasseniorliving.net/wp-content/uploads/2025/06/Video-surv.policy.docx", departamento: "Clinical Policy" },
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
  { id: 489, nombre: "Weapons.docx", letra: "W", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Weapons.docx", departamento: "Clinical Policy" },
  { id: 490, nombre: "Weighing Residents.docx", letra: "W", link: "https://atlasseniorliving.net/wp-content/uploads/2025/03/Weighing-Residents-Policy.docx", departamento: "Clinical Policy" },
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
];

const CATEGORIAS = ['All', 'Clinical Policy', 'Job Description', 'Redirect Link'];

const OFFICE_STYLES = {
  pdf:  { icon: '📕', color: '#EE3322', bg: 'bg-red-50',  label: 'PDF' },
  doc:  { icon: '📘', color: '#2B579A', bg: 'bg-blue-50', label: 'Word' },
  docx: { icon: '📘', color: '#2B579A', bg: 'bg-blue-50', label: 'Word' },
  xls:  { icon: '📗', color: '#217346', bg: 'bg-green-50', label: 'Excel' },
  xlsx: { icon: '📗', color: '#217346', bg: 'bg-green-50', label: 'Excel' },
  pptx: { icon: '📙', color: '#FF6802', bg: 'bg-orange-50', label: 'PowerPoint' },
  link: { icon: '🔗', color: '#2B579A', bg: 'bg-gray-50', label: 'URL' },
  default: { icon: '📁', color: '#64748b', bg: 'bg-slate-50', label: 'File' }
};

export default function App() {
  const [autenticado, setAutenticado] = useState(() => {
    const sesionActiva = localStorage.getItem('atlas_session');
    return sesionActiva === 'true';
  });
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

  useEffect(() => {
    localStorage.setItem('atlas_favs', JSON.stringify(favoritos));
  }, [favoritos]);

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
          stellarBurst(cx, cy, { durationMs: 5600, speedScale: 0.8, lifeDecay: 0.016, size: 160 });
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
  const STATES = ['ALABAMA','FLORIDA','GEORGIA','KENTUCKY','MARYLAND','MISSISSIPPI','SOUTH CAROLINA','TENNESSEE','TEXAS','VIRGINIA'];
  
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
    setAutenticado(false);
  };

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
                  className="grid grid-cols-2 gap-3 pt-3"
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
                            <circle cx="2" cy="2" r="1.5"/><circle cx="2" cy="6" r="1.5"/><circle cx="2" cy="10" r="1.5"/>
                            <circle cx="6" cy="2" r="1.5"/><circle cx="6" cy="6" r="1.5"/><circle cx="6" cy="10" r="1.5"/>
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
                             <a href={doc.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 font-bold hover:text-blue-500 transition-colors flex items-center gap-1 cursor-pointer">Open File <span>→</span></a>
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
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                    isActive 
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
            <button onClick={() => {setBusqueda(''); setLetraFiltro('All'); setCatFiltro('All'); setStateFiltro('');}} className="bg-red-50 text-red-500 px-6 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all cursor-pointer">Clear</button>
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
                className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer border ${
                  active 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {archivosFiltrados.map(doc => {
            const style = getFileDetails(doc.nombre);
            const isFav = favoritos.includes(doc.id);
            const isAnimating = animatingIds.includes(doc.id);
            const colors = getColorClasses(doc.departamento);
            
            return (
              <div key={doc.id} className="group bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-visible z-0 hover:z-10">
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
           <a href={`mailto:${CONFIG.emailSoporte}`} className="text-slate-400 hover:text-blue-600 text-xs font-bold py-1.5 transition-colors">Report Issue</a>
           <button onClick={handleLogout} className="text-slate-400 hover:text-gray-600 text-xs bg-black text-white px-4 py-1.5 rounded-lg cursor-pointer font-bold transition-colors">Logout</button>
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
