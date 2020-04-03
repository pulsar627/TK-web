import { Component, OnInit } from '@angular/core';
import { Job } from './domain/Job';
import { JobService } from './services/JobService';
import { LazyLoadEvent } from 'primeng/api/public_api';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [JobService]
})
export class AppComponent implements OnInit {

    displayDialog: boolean;

    job: Job = new Job();

    selectedJob: Job;

    jobs: Job[];

    cols: any[];

    totalRecords: number;

    loading = true;

    ErrorMsg = '';

    constructor(private jobService: JobService) { }

    ngOnInit() {
        this.jobService.getCount().subscribe(result => {
            this.totalRecords = result;
        });
        this.cols = [
            { field: 'id', header: 'Job Id' },
            { field: 'jobTitle', header: 'Job Title' },
            { field: 'jobUrl', header: 'Job Url' },
            { field: 'postedBy', header: 'Posted By' },
            { field: 'appliedBy', header: 'Applied By' }
        ];
        this.loading = true;
    }

    showDialogToAdd() {
        this.job = new Job();
        this.displayDialog = true;
    }
    save() {
        this.jobService.save(this.job).subscribe(result => {
            const jobsCopy = [...this.jobs];
            jobsCopy[this.findSelectedJobIndex()] = this.job;
            this.jobs = jobsCopy;
            this.job = null;
            this.displayDialog = false;
        }, (error => {
            this.loading = false;
            this.ErrorMsg = 'Sorry, Something Went wrong while processing your request. Please contact your supervisor ';
        }));
    }


    findSelectedJobIndex(): number {
        return this.jobs.indexOf(this.selectedJob);
    }
    onRowSelect(event: any) {
        if (event.data.appliedBy) {
            this.ErrorMsg = 'This job is already applied';
            return;
        }
        if (!event.data.jobUrl) {
            this.ErrorMsg = 'Invalid url';
            return;
        }
        console.log(!event.data.appliedBy);
        console.log(event.data.jobUrl);
        if (!event.data.appliedBy  && event.data.jobUrl) {
            let url = '';
            if (!/^http[s]?:\/\//.test(event.data.jobUrl)) {
                url += 'http://';
            }
            url += event.data.jobUrl;
            window.open(url, '_blank');
            this.displayDialog = true;
            console.log(event.data.jobUrl);
        }
        this.job = this.cloneJob(event.data);
    }
    cloneJob(c: Job): Job {
        const job = new Job();
        for (const prop of Object.keys(c)) {
            job[prop] = c[prop];
        }
        return job;
    }
    getClassByValue(i: any) {
        if (i) {
            return 'url-disabled';
        } else {
            return 'url-enabled';
        }
    }
    loadJobsLazy(event: LazyLoadEvent) {
        this.loading = true;
        this.jobService.getJobsByPage(event).subscribe(jobs => {
            this.jobs = jobs;
            this.loading = false;
        }, (error => {
            this.loading = false;
            this.ErrorMsg = 'Sorry, Something Went wrong while processing your request. Please contact your supervisor ';
        })
        );
    }

}
