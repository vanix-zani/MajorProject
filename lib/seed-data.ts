import connectToDatabase from "./db"
import User from "./models/user"
import Subject from "./models/subject"
import Topic from "./models/topic"
import Material from "./models/material"
import Quiz from "./models/quiz"

export async function seedDatabase() {
  try {
    console.log("Connecting to database...")
    await connectToDatabase()

    console.log("Seeding database...")

    // Check if data already exists
    const userCount = await User.countDocuments()
    if (userCount > 0) {
      console.log("Database already seeded. Skipping...")
      return
    }

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      class: 12,
      role: "admin",
    })

    console.log("Created admin user:", adminUser.email)

    // Create student user
    const studentUser = await User.create({
      name: "Student User",
      email: "student@example.com",
      password: "password123",
      class: 10,
      role: "student",
    })

    console.log("Created student user:", studentUser.email)

    // Create subjects
    const subjects = await Subject.insertMany([
      {
        name: "Mathematics",
        class: 10,
        description: "Algebra, Geometry, and more",
      },
      {
        name: "Science",
        class: 10,
        description: "Physics, Chemistry, and Biology",
      },
      {
        name: "English",
        class: 10,
        description: "Grammar, Literature, and Composition",
      },
      {
        name: "History",
        class: 10,
        description: "World History and Civics",
      },
    ])

    console.log("Created subjects:", subjects.length)

    // Create topics
    const topics = []

    // Math topics
    const mathTopics = await Topic.insertMany([
      {
        name: "Algebra",
        subject: subjects[0]._id,
        description: "Equations, expressions, and functions",
      },
      {
        name: "Geometry",
        subject: subjects[0]._id,
        description: "Shapes, angles, and theorems",
      },
      {
        name: "Trigonometry",
        subject: subjects[0]._id,
        description: "Sine, cosine, and tangent",
      },
    ])

    topics.push(...mathTopics)

    // Science topics
    const scienceTopics = await Topic.insertMany([
      {
        name: "Physics",
        subject: subjects[1]._id,
        description: "Forces, motion, and energy",
      },
      {
        name: "Chemistry",
        subject: subjects[1]._id,
        description: "Elements, compounds, and reactions",
      },
      {
        name: "Biology",
        subject: subjects[1]._id,
        description: "Cells, organisms, and ecosystems",
      },
    ])

    topics.push(...scienceTopics)

    // English topics
    const englishTopics = await Topic.insertMany([
      {
        name: "Grammar",
        subject: subjects[2]._id,
        description: "Parts of speech and sentence structure",
      },
      {
        name: "Literature",
        subject: subjects[2]._id,
        description: "Novels, poetry, and drama",
      },
    ])

    topics.push(...englishTopics)

    // History topics
    const historyTopics = await Topic.insertMany([
      {
        name: "World History",
        subject: subjects[3]._id,
        description: "Ancient civilizations to modern times",
      },
      {
        name: "Civics",
        subject: subjects[3]._id,
        description: "Government, rights, and responsibilities",
      },
    ])

    topics.push(...historyTopics)

    console.log("Created topics:", topics.length)

    // Create materials
    const materials = []

    // Create materials for each topic
    for (const topic of topics) {
      const topicMaterials = await Material.insertMany([
        {
          title: `Introduction to ${topic.name}`,
          topic: topic._id,
          type: "pdf",
          content: `Comprehensive guide to ${topic.name}`,
          url: "public\SM_6th-Sem__Cse_Internet-of-Things.pdf",
        },
        {
          title: `${topic.name} Explained`,
          topic: topic._id,
          type: "video",
          content: `Video tutorial explaining ${topic.name} concepts`,
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        {
          title: `${topic.name} Practice Problems`,
          topic: topic._id,
          type: "pdf",
          content: `Collection of practice problems for ${topic.name}`,
          url: "#",
        },
        {
          title: `Key Concepts in ${topic.name}`,
          topic: topic._id,
          type: "note",
          content: `
            <h2 class="text-xl font-bold mb-4">Key Concepts in ${topic.name}</h2>
            
            <p class="mb-4">This note covers the fundamental concepts you need to understand about ${topic.name}.</p>
            
            <h3 class="text-lg font-semibold mb-2">1. Basic Principles</h3>
            <p class="mb-4">The basic principles of ${topic.name} include understanding the core theories and how they apply to real-world scenarios.</p>
            
            <h3 class="text-lg font-semibold mb-2">2. Important Formulas</h3>
            <p class="mb-4">There are several key formulas that you should memorize:</p>
            <ul class="list-disc pl-6 mb-4">
              <li>Formula 1: E = mc²</li>
              <li>Formula 2: a² + b² = c²</li>
              <li>Formula 3: F = ma</li>
            </ul>
            
            <h3 class="text-lg font-semibold mb-2">3. Applications</h3>
            <p class="mb-4">Understanding how to apply these concepts to solve problems is crucial for mastery.</p>
            
            <h3 class="text-lg font-semibold mb-2">4. Common Mistakes</h3>
            <p>Be aware of these common mistakes students make when working with ${topic.name}:</p>
            <ul class="list-disc pl-6">
              <li>Mistake 1: Forgetting to convert units</li>
              <li>Mistake 2: Applying the wrong formula</li>
              <li>Mistake 3: Calculation errors</li>
            </ul>
          `,
        },
      ])

      materials.push(...topicMaterials)
    }

    console.log("Created materials:", materials.length)

    // Create quizzes
    const quizzes = []

    // Create a quiz for each topic
    for (const topic of topics) {
      // Create questions
      const questions = []

      for (let i = 0; i < 10; i++) {
        questions.push({
          text: `Question ${i + 1}: This is a sample question about ${topic.name}?`,
          options: [
            { text: "Option A", isCorrect: i % 4 === 0 },
            { text: "Option B", isCorrect: i % 4 === 1 },
            { text: "Option C", isCorrect: i % 4 === 2 },
            { text: "Option D", isCorrect: i % 4 === 3 },
          ],
        })
      }

      const quiz = await Quiz.create({
        title: `${topic.name} Basics`,
        topic: topic._id,
        description: `Test your knowledge of basic ${topic.name} concepts`,
        questions,
        timeLimit: 15,
      })

      quizzes.push(quiz)
    }

    console.log("Created quizzes:", quizzes.length)

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}
