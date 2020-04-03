import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Job } from '../domain/Job';
import { LazyLoadEvent } from 'primeng/api/public_api';


@Injectable({ providedIn: 'root' })

export class JobService {

    private getCountUrl = 'https://portal-trial-api.azurewebsites.net/api/jobs/count';
    private getJobsByPageUrl = 'https://portal-trial-api.azurewebsites.net/api/jobs';
    private updateUrl = 'https://portal-trial-api.azurewebsites.net/api/jobs/update';

    constructor(private httpClient: HttpClient) { }

    getJobsByPage(dataFilters: LazyLoadEvent): Observable<any> {
        const httpHeaders = new HttpHeaders()
            .set('Accept', 'application/json');
        let httpParams = new HttpParams();
        if (dataFilters.filters) {
            for (const [key1] of Object.entries(dataFilters.filters)) {
                httpParams = httpParams.append(key1, dataFilters.filters[key1].value);
            }
        }
        console.log(httpParams.toString());
        return this.httpClient.get<Job[]>(`${this.getJobsByPageUrl}/${dataFilters.first}/${dataFilters.rows}`, {
            headers: httpHeaders,
            params: httpParams
        }).pipe(
             tap(t => {
                console.log('getsuccess');
            }),
            catchError(er => {
                console.log('get failed');
                return throwError(er);
            })
            );
    }
    getCount(): Observable<any> {
        return this.httpClient.get<number>(this.getCountUrl);
    }

    save(job: Job): Observable<any> {
       return this.httpClient.put<Job>(this.updateUrl, job)
            .pipe(
                catchError(er => {
                    console.log('update failed');
                    return throwError(er);
                })
                );
    }
}
