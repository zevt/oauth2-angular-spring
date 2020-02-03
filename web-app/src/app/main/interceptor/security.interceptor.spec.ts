import { TestBed } from '@angular/core/testing';
import {SecurityInterceptor} from './security.interceptor';


describe('SecurityInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SecurityInterceptor = TestBed.get(SecurityInterceptor);
    expect(service).toBeTruthy();
  });
});
