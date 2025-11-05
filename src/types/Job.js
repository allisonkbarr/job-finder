/**
 * Job data structure
 * Represents a job posting from any job board
 */
export class Job {
  constructor(data) {
    this.title = data.title;
    this.company = data.company;
    this.location = data.location;
    this.locationType = data.locationType; // 'remote', 'hybrid', 'in-person'
    this.description = data.description;
    this.url = data.url;
    this.source = data.source; // 'linkedin', 'indeed', 'github', etc.
    this.postedDate = data.postedDate; // Date object or ISO string
    this.applicationCount = data.applicationCount || null;
    this.isPromoted = data.isPromoted || false;
    this.companySize = data.companySize || null;
    this.fundingStage = data.fundingStage || null;
    this.id = data.id || this.generateId();
  }

  generateId() {
    // Create a unique ID based on title, company, and source
    const str = `${this.title}-${this.company}-${this.source}`;
    return Buffer.from(str).toString('base64').slice(0, 32);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      company: this.company,
      location: this.location,
      locationType: this.locationType,
      description: this.description,
      url: this.url,
      source: this.source,
      postedDate: this.postedDate instanceof Date 
        ? this.postedDate.toISOString() 
        : this.postedDate,
      applicationCount: this.applicationCount,
      isPromoted: this.isPromoted,
      companySize: this.companySize,
      fundingStage: this.fundingStage,
    };
  }

  static fromJSON(data) {
    const job = new Job(data);
    if (typeof data.postedDate === 'string') {
      job.postedDate = new Date(data.postedDate);
    }
    return job;
  }
}

