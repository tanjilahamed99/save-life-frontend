export const blogs = [
  {
    id: 1,
    shortTitle: "Clonazepam (Rivotril): Treatment for Anxiety Disorders and Epilepsy",
    date: "March 15, 2025",
    author: "Jemin Bond",
    excerpt: 10,
    title: "Clonazepam (brand name Rivotril) is a prescription medication primarily used to treat anxiety disorders, panic attacks, and certain types of epilepsy. As a benzodiazepine, it enhances the effect of GABA, a calming neurotransmitter in the brain.",
    category: "Products",
    image: "/images/products/Clonazepam2mg.webp",
    content: `<p><strong>Clonazepam</strong> is a medication belonging to the benzodiazepine class. It has sedative, muscle-relaxing, anti-anxiety, and anti-epileptic properties.</p>

<p><strong>Overview:</strong></p>
<ul class="list-disc list-inside">
  <li>What clonazepam is used for</li>
  <li>Proper dosage guidelines</li>
  <li>Common side effects & risks</li>
  <li>Addiction potential & withdrawal symptoms</li>
  <li>Safety precautions & alternatives</li>
</ul>

<p><strong>What is Clonazepam?</strong></p>
<p>Clonazepam is a benzodiazepine that calms excessive brain activity. It is often prescribed for various medical conditions.</p>

<p><strong>Indications:</strong></p>
<ul class="list-disc list-inside">
  <li>Generalized anxiety disorder</li>
  <li>Panic disorder</li>
  <li>Social phobia</li>
  <li>Epilepsy (adjunctive treatment)</li>
  <li>Myoclonic seizures</li>
  <li>Absence seizures</li>
  <li>Insomnia (off-label use)</li>
  <li>Restless legs syndrome (RLS)</li>
</ul>

<p><strong>How Does Clonazepam Work?</strong></p>
<p>Clonazepam enhances the effect of GABA, a calming neurotransmitter in the brain, leading to the following therapeutic effects:</p>
<ul class="list-disc list-inside">
  <li>Reduces anxiety</li>
  <li>Relaxes muscles</li>
  <li>Anti-epileptic effects</li>
  <li>Causes a sedative effect at higher doses</li>
</ul>

<p><strong>Dosage Guidelines:</strong></p>
<p>Clonazepam dosage depends on the specific condition and individual patient needs:</p>

<p><strong>For Anxiety Disorders:</strong></p>
<ul class="list-disc list-inside">
  <li>Starting dose: 0.25-0.5 mg (2-3 times daily)</li>
  <li>Maintenance dose: 1-4 mg per day</li>
</ul>

<p><strong>For Epilepsy:</strong></p>
<ul class="list-disc list-inside">
  <li>Adults: 1.5-20 mg per day (divided doses)</li>
  <li>Children: 0.01-0.03 mg/kg per day</li>
</ul>

<p><strong>Important:</strong> Do not stop abruptly—taper dose gradually under medical supervision.</p>

<p><strong>Common Side Effects:</strong></p>
<ul class="list-disc list-inside">
  <li>Drowsiness</li>
  <li>Dizziness</li>
  <li>Blurred vision</li>
  <li>Memory problems</li>
</ul>

<p><strong>Serious Side Effects (Consult a doctor):</strong></p>
<ul class="list-disc list-inside">
  <li>Extreme drowsiness or confusion</li>
  <li>Breathing difficulties</li>
  <li>Mood changes (depression, aggression)</li>
  <li>Dependence symptoms (cravings, withdrawal)</li>
</ul>

<p><strong>Dependence and Withdrawal:</strong></p>
<p>Clonazepam can be addictive with long-term use (longer than 4 weeks). Withdrawal symptoms may include:</p>
<ul class="list-disc list-inside">
  <li>Return of anxiety and insomnia</li>
  <li>Tremors and sweating</li>
  <li>Seizures (rare)</li>
</ul>

<p><strong>Safe Discontinuation:</strong></p>
<ul class="list-disc list-inside">
  <li>Gradual dose reduction under medical supervision</li>
  <li>Avoid alcohol and other sedatives</li>
  <li>Consider alternative treatments (Cognitive Behavioral Therapy, SSRIs)</li>
</ul>

<p><strong>Warnings & Drug Interactions:</strong></p>
<ul class="list-disc list-inside">
  <li>Avoid in liver disease</li>
  <li>Individuals with a history of addiction</li>
  <li>Pregnant or breastfeeding women</li>
  <li>Use with opioids or alcohol (risk of respiratory depression)</li>
</ul>

<p><strong>Drug Interactions:</strong></p>
<ul class="list-disc list-inside">
  <li>Opioids → Increased sedation and overdose risk</li>
  <li>Alcohol → Dangerous CNS depression</li>
  <li>SSRIs/TCAs → Enhanced side effects</li>
</ul>

<p><strong>Alternatives to Clonazepam:</strong></p>
<ul class="list-disc list-inside">
  <li>SSRIs (e.g., Sertraline, Escitalopram) for long-term anxiety treatment</li>
  <li>Buspirone for anxiety relief without sedation</li>
  <li>Cognitive Behavioral Therapy (CBT) for drug-free anxiety treatment</li>
  <li>Gabapentin/Pregabalin for nerve-related anxiety and epilepsy</li>
</ul>

<p><strong>Frequently Asked Questions:</strong></p>
<p><strong>1. Is Clonazepam a narcotic?</strong> No, but it is a controlled substance due to abuse potential.</p>
<p><strong>2. How long does Clonazepam stay in the body?</strong> Half-life: 18-50 hours. Detectable in urine for up to 30 days with chronic use.</p>
<p><strong>3. Can Clonazepam cause memory loss?</strong> Yes, long-term use may affect memory and cognition.</p>
<p><strong>4. What's the difference between Clonazepam and Xanax?</strong> Clonazepam has a longer duration and is used for chronic anxiety/epilepsy, while Xanax works faster for panic attacks.</p>

<p><strong>Conclusion:</strong> Clonazepam is effective for anxiety and epilepsy but carries risks like dependence. It should be used under strict medical supervision, and alternatives should be considered for long-term use.</p>
`,
  },
];

export const getBlogDataById = (id) => {
  //   console.log(id);
  const product = blogs.find((b) => b.id === parseFloat(id));
  return Promise.resolve(product || null);
};

export const getBlogsByCategory = (category) => {
  console.log(category);
  if (!category || category === "Alle categorieën") {
    return Promise.resolve(blogs);
  }
  const filteredBlogs = blogs.filter(
    (blog) => blog.category.toLowerCase() === category.toLowerCase()
  );
  return Promise.resolve(filteredBlogs);
};

export const getRelatedArticle = (category, displayId) => {
//   if (!category || !displayId) {
//     return Promise.resolve();
//   }
//   const filter = blogs.filter((blog) => blog.category === category);
//   const relatedArticle = filter.filter((i) => i.is !== parseFloat(displayId));
//   return Promise.resolve(relatedArticle);
};
